#!/usr/bin/python3

# Copyright 2018 Blade M. Doyle
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import os
import time
from datetime import datetime
from random import randint
import socket
from urllib.parse import urlparse
import requests
import json


from mwclib import lib
from mwclib import mwc
from mwclib import payments
from mwcbase.model.pool_utxo import Pool_utxo
from mwcbase.model.pool_payment import Pool_payment

PROCESS = "makePayouts"
LOGGER = None
CONFIG = None

# Get K8s secret from container environment
wallet_api_user = os.environ['WALLET_OWNER_API_USER']
wallet_api_key = os.environ["WALLET_OWNER_API_PASSWORD"]

# XXX TODO:  Add maximum payout value to reduce the pools risk?

def main():
    global LOGGER
    global CONFIG
    CONFIG = lib.get_config()
    LOGGER = lib.get_logger(PROCESS)
    LOGGER.warning("=== Starting {}".format(PROCESS))

    # Connect to DB
    database = lib.get_db()
    # Configs
    minimum_payout = int(CONFIG[PROCESS]["minimum_payout"])
    walletauth = (wallet_api_user, wallet_api_key)

    utxos = Pool_utxo.getPayable(minimum_payout)

    # XXX TODO: Use the current balance, timestamp, the last_attempt timestamp, last_payout, and failed_attempts
    # XXX TODO: to filter and sort by order we want to make payment attempts
    for utxo in utxos:
        try:
            # Try less often for wallets that dont answer
            if utxo.amount < utxo.failure_count:
                if randint(0, 11) != 0:
                    continue
            LOGGER.warning("Processing utxo for: {} {} {} using method: {}".format(utxo.user_id, utxo.address, utxo.amount, utxo.method))
            if utxo.method in ["http", "https", "mwcmqs"]:
                try:
                                        #user_id,      address,      logger, database, wallet_auth, method,     invoked_by
                    payments.atomic_send(utxo.user_id, utxo.address, LOGGER, database, utxo.method, "schedule")
                except payments.PaymentError as e:
                    LOGGER.error("Failed to make http payment: {}".format(e))
            else:
                LOGGER.warning("Automatic payment does not (yet?) support method: {}".format(utxo.method))

        except Exception as e:
            LOGGER.error("Failed to process utxo: {} because {}".format(utxo.user_id, str(e)))
            database.db.getSession().rollback()
            sys.exit(1)

    LOGGER.warning("=== Completed {}".format(PROCESS))

if __name__ == "__main__":
    main()

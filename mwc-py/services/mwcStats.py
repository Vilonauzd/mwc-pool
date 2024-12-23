#!/usr/bin/python

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

# Add a mwc network stats record ~per block

import sys
import requests
import json
import atexit
from time import sleep

from mwclib import lib
from mwclib import mwc
from mwclib import mwcstats

from mwcbase.model.blocks import Blocks
from mwcbase.model.mwc_stats import mwc_stats

PROCESS = "mwcStats"
LOGGER = None
CONFIG = None

# XXX TODO: Move to config
BATCHSZ = 1

def main():
    CONFIG = lib.get_config()
    LOGGER = lib.get_logger(PROCESS)
    LOGGER.warn("=== Starting {}".format(PROCESS))
    # Connect to DB
    database = lib.get_db()
    atexit.register(lib.teardown_db)
    check_interval = float(CONFIG[PROCESS]["check_interval"])
    avg_over_range = int(CONFIG[PROCESS]["avg_over_range"])

    # Find the height of the latest stats record
    last_height = 0
    latest_stat = mwc_stats.get_latest()
    LOGGER.warning("latest_stat = {}".format(latest_stat))

    if latest_stat == None:
        LOGGER.warn("Initializing mwc_stats")
        mwcstats.initialize(avg_over_range, LOGGER)
        latest_stat = mwc_stats.get_latest()
        LOGGER.warning("Finished initializing, latest_stat height = {}".format(latest_stat.height))
    last_height = latest_stat.height
    height = last_height + 1
    LOGGER.warn("mwcStats service starting at block height: {}".format(height))

    # Generate mwc stats records - one per mwc block
    while True:
        #latest_db_block = Blocks.get_latest()
        latest = Blocks.get_latest().height
        while latest >= height:
            try:
                new_stats = mwcstats.calculate(height, avg_over_range)
                # Batch new stats when possible, but commit at reasonable intervals
                database.db.getSession().add(new_stats)
#                if( (height % BATCHSZ == 0) or (height >= (latest-10)) ):
                database.db.getSession().commit()
                LOGGER.warn("Added mwc_stats for block: {} - gps:{} diff:{}".format(new_stats.height, new_stats.gps, new_stats.difficulty))
                height = height + 1
            except AssertionError as e:
                LOGGER.error("Something went wrong: {}".format(e))
                sleep(check_interval)
        sys.stdout.flush()
        sleep(check_interval)
    LOGGER.warn("=== Completed {}".format(PROCESS))


if __name__ == "__main__":
    main()

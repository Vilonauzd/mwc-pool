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

# This service provides high-level health checks for various components and services

import sys
import socket
import requests
import json
from datetime import datetime, timedelta

from flask import Flask, request, Response
from flask_restful import Resource, Api, reqparse

from mwclib import lib
from mwclib import mwc

PROCESS = "healthCheck"

# XXX TODO: Move to / get from  config
CACHE_TIME = 30
PORT = 32050
STRATUM_HOST = "stratum"
STRATUM_PORT = 3333
STRATUM_RECONNECT_INTERVAL = 10 # Attempt full reconnect every Nth test
mwc_API_URL = "http://mwc:3413"
mwcPOOL_API_URL = "http://api.mwcpool.com:3423"
mwcMINT_API_URL = "http://api.mwcmint.com"
mwc_HEIGHT_THRESHOLD = 5 # Number of blocks allowed to be behind

##
# GLOBALS
STRATUM_CONN = None
KEEPALIVE_MSG = '{"id":"0","jsonrpc":"2.0","method":"keepalive"}\n'.encode()
# Cached health status
STRATUM_HEALTH = (False, datetime.utcfromtimestamp(0),)
mwc_HEALTH = (False, datetime.utcfromtimestamp(0),)
WEBUI_HEALTH = (False, datetime.utcfromtimestamp(0),)
STRATUM_RECONNECT_CNT = STRATUM_RECONNECT_INTERVAL
# Public address to check
PUB_ADDRESS = "10.1.1.1"



app = Flask(__name__)
api = Api(app)

##
# Stratum
class Stratum_health(Resource):
    def get(self):
        global LOGGER
        global STRATUM_CONN
        global STRATUM_HOST
        global STRATUM_PORT
        global CACHE_TIME
        global STRATUM_HEALTH
        global STRATUM_RECONNECT_CNT

        # Report cached status if its Good and Clean
        if (STRATUM_CONN is not None) and (STRATUM_HEALTH[0] == True) and (STRATUM_HEALTH[1] > datetime.utcnow()):
            return Response("{'status':'ok'}", status=200, mimetype='application/json')

        # Attempt a full reconnect to public address on configured interval
        STRATUM_RECONNECT_CNT -= 1
        if STRATUM_RECONNECT_CNT <= 0:
            try:
                STRATUM_CONN.close()
                STRATUM_CONN = None
                STRATUM_RECONNECT_CNT = STRATUM_RECONNECT_INTERVAL
            except Exception as e:
                STRATUM_CONN = None
                STRATUM_RECONNECT_CNT = 0

        # If we are not currently connected to the stratum server, connect now
        if STRATUM_CONN is None:
            try:
                STRATUM_CONN = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                STRATUM_CONN.settimeout(5)
                STRATUM_CONN.connect((STRATUM_HOST, STRATUM_PORT))
            except Exception as e:
                LOGGER.error("Failed to connect to stratum server: {}:{}, {}".format(STRATUM_HOST, STRATUM_PORT, e))
                LOGGER.warning("Stratum health: failed")
                STRATUM_CONN = None
                STRATUM_HEALTH = (False, datetime.utcfromtimestamp(0))
                return Response("{'status':'failed'}", status=503, mimetype='application/json')

        # Send a keepalive message to check for life
        if self.check_keepalive():
            LOGGER.warning("Stratum health: ok")
            STRATUM_HEALTH = (True, datetime.utcnow() + timedelta(seconds=CACHE_TIME))
            return Response("{'status':'ok'}", status=200, mimetype='application/json')
        else:
            LOGGER.warning("Stratum health: failed")
            STRATUM_HEALTH = (False, datetime.utcfromtimestamp(0))
            return Response("{'status':'failed'}", status=503, mimetype='application/json')

    def check_keepalive(self):
        global STRATUM_CONN
        global LOGGER
        try:
            STRATUM_CONN.send(KEEPALIVE_MSG)
            data = STRATUM_CONN.recv(999999)
        except Exception as e:
            LOGGER.error("Failed to send keepalive to stratum connection: {}".format(e))
            STRATUM_CONN = None
            return False
        return True



##
# webui
class Webui_health(Resource):
    def get(self):
        # XXX TODO: Write this code
        global WEBUI_HEALTH
        global CACHE_TIME
        return Response("{'status':'ok'}", status=200, mimetype='application/json')



##
# mwc
class mwc_health(Resource):
    def get(self):
        global LOGGER
        global mwc_HEIGHT_THRESHOLD
        global mwc_HEALTH

        # Report cached status if its Good and Clean
        if (mwc_HEALTH[0] == True) and (mwc_HEALTH[1] > datetime.utcnow()):
            return Response("{'status':'ok'}", status=200, mimetype='application/json')

        # Get the current chain height of local node, api.mwmwcpool.com, and mwcmint.com api
        mwc_height = self.get_mwc_height()
        pool_height = self.get_mwcpool_height()
        mint_height = self.get_mwcmint_height()
        LOGGER.warning("mwc_height={}, pool_height={}, mint_height={}".format(mwc_height, pool_height, mint_height))
        if (mwc_height >= (pool_height - mwc_HEIGHT_THRESHOLD)) and (mwc_height >= (mint_height - mwc_HEIGHT_THRESHOLD)):
            LOGGER.warning("mwc health: ok")
            mwc_HEALTH = (True, datetime.utcnow() + timedelta(seconds=CACHE_TIME))
            return Response("{'status':'ok'}", status=200, mimetype='application/json')
        else:
            LOGGER.warning("mwc health: failed")
            mwc_HEALTH = (False, datetime.utcfromtimestamp(0))
            return Response("{'status':'failed'}", status=503, mimetype='application/json')
            
    # Get the current height of the "local" mwc node
    def get_mwc_height(self):
        status_url = mwc_API_URL + "/v1/status"
        latest = 0
        try:
            response = requests.get(status_url)
            latest = response.json()["tip"]["height"]
        except:
            pass
        return int(latest)

    # Get the height from the pools API
    def get_mwcpool_height(self):
        url = mwcPOOL_API_URL + "/mwc/block/height"
        latest = 0
        try:
            response = requests.get(url)
            latest = response.json()["height"]
        except:
            pass
        return int(latest)

    # Get the height from mwcMint Pool API
    def get_mwcmint_height(sef):
        url = mwcMINT_API_URL + "/v1/networkStats"
        latest = 0
        try:
            response = requests.get(url)
            latest = response.json()["height"]
        except:
            pass
        return int(latest)
        





api.add_resource(Stratum_health, '/health/stratum')
api.add_resource(Webui_health, '/health/webui')
api.add_resource(mwc_health, '/health/mwc')


def main():
    global PORT
    global LOGGER
    global PUB_ADDRESS
    CONFIG = lib.get_config()
    LOGGER = lib.get_logger(PROCESS)
    LOGGER.warning("=== Starting {}".format(PROCESS))

    # Get our public ip address
    ip_url = "http://jsonip.com"
    try:
        response = requests.get(ip_url)
        PUB_ADDRESS = response.json()["ip"]
        LOGGER.warning("Found my public IP address: {}".format(PUB_ADDRESS))
    except:
        LOGGER.error("Failed to get my public IP address")
        sys.exit(1)
    app.run(debug=True, host='0.0.0.0', port=PORT)
    LOGGER.warning("=== Completed {}".format(PROCESS))

if __name__ == "__main__":
    main()

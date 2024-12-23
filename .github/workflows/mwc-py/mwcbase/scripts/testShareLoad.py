#!/usr/bin/env python3

import time
import requests
import json
import sys


# mwcShare: /data/mwc/mwc.log
# Sep 07 04:20:37.615 INFO (Server ID: StratumServer) Got share for block: hash 8b5e9034, height 84561, nonce 18330770048594364165, difficulty 29/773, submitted by mwcPool
#
# and
# PoolShare: /data/stratum/mwc-pool.log
# Jun 05 15:15:43.658 WARN mwc Pool - Got share at height 98029 with nonce 13100465979295287452 with difficulty 1 from worker http://192.168.1.102:13415


# To Clean up after:
# delete from mwc_shares where found_by="test";
# delete from pool_shares where found_by="test";
# update pool_stats set dirty=1 where height=84600;
# update worker_stats set dirty=1 where height=84600;


mwclog = open('/data/mwc/mwc.log', 'a')
poollog = open('/data/stratum/mwc-pool.log', 'a')

nonce = 18330770149714411119
current = 0
LOAD = 750000


def get_height():
    status_url = "http://localhost:32413/v1/status"
    response = requests.get(status_url)
    height = response.json()["tip"]["height"]
    return int(height)

while True:
    height  = get_height() + 1
    print("Generating {} shares at height {}".format(LOAD, height))
    for i in range(0, LOAD):
        nonce = nonce + 1
        mwcshare = 'Sep 07 04:20:37.615 INFO (Server ID: StratumServer) Got share for block: hash 8b5e9034, height '+str(height)+', nonce '+str(nonce)+', difficulty 29/773, submitted by test\n'
        mwclog.write(mwcshare)
        mwclog.flush()
    
        poolshare = 'Sep 07 04:20:37.615 WARN mwc Pool - Got share at height '+str(height)+' with nonce '+str(nonce)+' with difficulty 1 from worker test\n'
        poollog.write(poolshare)
        poollog.flush()

    while height == get_height()+1:
        time.sleep(1)

mwclog.close()
poollog.close()

#!/bin/bash

initial_delay=$((10 * 60 - $(date +%M) * 60 - $(date +%S)))

sleep $initial_delay
while true; do
    /usr/local/bin/paymentMaker.py
    sleep 3600
done

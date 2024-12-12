#!/bin/bash
# Infinite loop to run the script every hour, 5 minutes past the hour

while true; do
    /usr/local/bin/poolblockUnlocker.py
    # Sleep for one hour
    sleep 3600
done

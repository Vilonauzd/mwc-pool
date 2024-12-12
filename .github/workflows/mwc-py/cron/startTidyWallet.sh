#!/bin/bash

# Infinite loop to run the tidy wallet script every hour
while true; do
    /usr/local/bin/tidyWallet.py
    # Sleep for one hour before running the script again
    sleep 3600
done

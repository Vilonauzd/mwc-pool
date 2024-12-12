#!/bin/bash

while true; do
    echo "$(date) - Starting blockValidator"
    /usr/local/bin/blockValidator.py

    if [ $? -ne 0 ]; then
        echo "$(date) - Error running blockValidator" >&2
    else
        echo "$(date) - blockValidator ran successfully"
    fi
    sleep 180
done
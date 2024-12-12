#!/bin/bash

env_file=".env"


if [ -f "$env_file" ]; then
    source "$env_file"
else
    echo "Error: .env file not found at $env_file"
    exit 1
fi

if [ -z "$POOL_DATA_DIR" ]; then
    echo "POOL_DATA_DIR is not set in the .env file."
    exit 1
fi


subdirs=("letsencrypt" "mysql" "rmq" "stratum" "stratum2" "mwc" "redis-master" "services" "stratum1" "wallet")

if [ ! -d "$POOL_DATA_DIR" ]; then
    mkdir "$POOL_DATA_DIR"
    echo "Created directory: $POOL_DATA_DIR"
else
    echo "Directory already exists: $POOL_DATA_DIR"
fi

for dir in "${subdirs[@]}"; do
    subdir="${POOL_DATA_DIR}/${dir}"
    if [ ! -d "$subdir" ]; then
        mkdir "$subdir"
        echo "Created directory: $subdir"
    else
        echo "Directory already exists: $subdir"
    fi
done

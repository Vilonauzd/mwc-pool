#!/bin/bash

# Update API Port for remote stratum
if [ ! -z "$APIPORT" ]; then
    sed -i "s/^api_port = .*$/api_port = ${APIPORT}/" /usr/local/bin/mwc-pool.toml
fi


echo "Starting mwcPool Stratum Server"
cp /usr/local/bin/mwc-pool.toml /stratum/
/usr/local/bin/mwc-pool

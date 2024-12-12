#!/bin/bash

# Live here
cd /server

# Put config file in place
cp /usr/src/mwc/mwc-server.toml /server/mwc-server.toml

# Update mwc-server config
if [ "$NET_FLAG" = "--floonet" ]; then
    # Set Network Flag in TOML Config
    sed -i 's/chain_type = .*/chain_type = \"Floonet\"/' /server/mwc-server.toml
fi
if [  "$NET_FLAG" == "--floonet" ]; then
    # disable mainnet preferred peers
    sed -i 's/peers_preferred = .*$/#peers_preferred = []/' /server/mwc-server.toml
fi
if [ ! -z "$WALLETPORT" ]; then
    # Update Wallet Port for remote stratum
    sed -i "s/^wallet_listener_url = .*$/wallet_listener_url = \"http:\/\/wallet:${WALLETPORT}\"/" /server/mwc-server.toml
fi

#echo "Backup Chain Data"
#tar czf mwc.backup.$(date "+%F-%T" |tr : '_').tgz .mwc

mwc ${NET_FLAG} server run

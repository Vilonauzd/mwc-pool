# Deploy MWC-Pool to a single VM using docker-compose

## Provision a VM
* 2 vCPU 4G Mem minimum
* 150/200 GB
* Install: git, Docker,  and docker-compose
* Static public IP address
* Open ports inbound: 80, 443, 2222, 3333
* Configure a Domain Name: Set DNS A records for .domain, api.domain, and stratum.domain



## Edit Configuration (Yes, its a mess and needs to be improved)
* mwc-pool/docker-compose/.env
* mwc-pool/mwc-js/webui/src/config.js
* mwc-pool/mwc-py/services/config.ini
* mwc-pool/nginx/src/\*.conf
* mwc-pool/stratum/mwc-pool.toml
* Maybe a few others....

## Build and Run it

### MWC Node
Build and start the mwc node first and give it an hour to sync
* cd mwc-pool/docker-compose
* ./create_dir.sh
* docker-compose up -d --build mwc
* docker-compose logs -f

### The Pool
Build and start the pool
* cd mwc-pool/docker-compose
* docker-compose up -d --build
* docker-compose logs -f

### Bugs
* You will see lots of connection errors at first pool startup.  Its normal for a few minutes
* It may be necessary to restart the pool (docker-compose down/up) a few times for new installs

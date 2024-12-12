# mwc-pool

## What it is:
An Open Source Mining Pool for MWCMimbleWimble Cryptocurrency Implementation

### The architecture:
* Microservices

### The components:
* Pool Stratum Proxy: Rust
* Pool data processing jobs: Python3/SQLAlchemy
* Pool API: Python3/Flask/gunicorn
* Pool Web UI: NodeJS/Electron/Bootstrap/React
* Database: MariaDB/Redis
* Build/Packaging: Docker
* Deploy: Kubernetes/Docker-compose
* Orchestration: Kubernetes
* Log collection: Splunk
* Load Balancer/Certificates: NGINX/LetsEncrypt
* Monitoring & Alerting: ?? NotYet (Icinga?)

#### To run the pool yourself use: [docker-compose/README.md](docker-compose/README.md)

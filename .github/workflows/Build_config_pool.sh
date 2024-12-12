# Update and install required tools
sudo apt update
sudo apt install -y git build-essential curl software-properties-common

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Certbot for Let’s Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Install Splunk Forwarder (Optional if already configured)
wget -O splunkforwarder.deb 'https://download.splunk.com/products/universalforwarder/releases/8.2.10/linux/splunkforwarder-8.2.10-ddff1c41e5cf-linux-2.6-amd64.deb'
sudo dpkg -i splunkforwarder.deb
sudo /opt/splunkforwarder/bin/splunk start --accept-license
sudo /opt/splunkforwarder/bin/splunk enable boot-start

# Clone the repository
cd /home/svc_mwc
git clone git@github.com:vekamo/pool.git mwc-pool
cd mwc-pool

# Verify Docker Compose File
ls docker-compose.yml
cat docker-compose.yml

# Start Docker Containers
docker-compose up -d

# Check Logs for Docker Services
docker-compose logs -f

# Configure Nginx Proxy (Optional if included in Docker setup)
sudo nano /etc/nginx/sites-available/mwc-pool

# Example Nginx Config for Proxy
# -----------------------------------
# server {
#     listen 80;
#     server_name mw.yhash.net;
#     location / {
#         proxy_pass http://127.0.0.1:3333; # Replace with your app's port
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }
# -----------------------------------

# Enable Nginx Configuration
sudo ln -s /etc/nginx/sites-available/mwc-pool /etc/nginx/sites-enabled
sudo systemctl reload nginx

# Set up SSL using Certbot
sudo certbot --nginx -d mw.yhash.net

# Verify the Setup
docker ps
sudo systemctl status nginx

# Monitor Logs
docker-compose logs -f

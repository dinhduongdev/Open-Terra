#!/bin/bash

# ==============================================================================
# Open Terra - SSL Certificate Generation with Let's Encrypt
# ==============================================================================
# This script generates SSL certificates for all Open Terra domains using Certbot
# 
# Usage:
#   chmod +x init-letsencrypt.sh
#   ./init-letsencrypt.sh
#
# Prerequisites:
#   - Docker and Docker Compose installed
#   - Domains must point to your server's IP address
#   - Port 80 must be accessible from the internet
# ==============================================================================

set -e

# Domain list
domains=(
  "backend.open-terra.io.vn"
  "dummy-iot.open-terra.io.vn"
  "opendata.open-terra.io.vn"
)

# Email for Let's Encrypt notifications
email="hoanganhduy75@gmail.com" 

# Staging mode (set to 1 for testing, 0 for production)
staging=0

# Paths
data_path="./letsencrypt"
certbot_path="./certbot"
nginx_conf="./nginx.conf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Open Terra SSL Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if email is configured
if [ "$email" = "your-email@example.com" ]; then
  echo -e "${RED}Error: Please update the 'email' variable in this script${NC}"
  exit 1
fi

# Create necessary directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p "$data_path/live"
mkdir -p "$data_path/archive"
mkdir -p "$certbot_path/www"
mkdir -p "$certbot_path/conf"

# Download recommended TLS parameters if they don't exist
if [ ! -e "$data_path/options-ssl-nginx.conf" ] || [ ! -e "$data_path/ssl-dhparams.pem" ]; then
  echo -e "${YELLOW}Downloading recommended TLS parameters...${NC}"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/ssl-dhparams.pem"
  echo -e "${GREEN}✓ Downloaded TLS parameters${NC}"
fi

# Backup original nginx.conf and use initial config
echo -e "${YELLOW}Preparing initial nginx configuration...${NC}"
if [ -e "$nginx_conf" ] && [ ! -e "$nginx_conf.backup" ]; then
  cp "$nginx_conf" "$nginx_conf.backup"
  echo -e "${GREEN}✓ Backed up nginx.conf${NC}"
fi
cp nginx.conf.initial nginx.conf.temp
echo -e "${GREEN}✓ Using temporary HTTP-only configuration${NC}"

# Create dummy certificates for all domains
echo -e "${YELLOW}Creating dummy certificates...${NC}"
for domain in "${domains[@]}"; do
  domain_path="$data_path/live/$domain"
  mkdir -p "$domain_path"
  
  if [ ! -e "$domain_path/fullchain.pem" ]; then
    echo -e "${YELLOW}Creating dummy certificate for $domain${NC}"
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout "$domain_path/privkey.pem" \
      -out "$domain_path/fullchain.pem" \
      -subj "/CN=$domain" 2>/dev/null
    echo -e "${GREEN}✓ Created dummy certificate for $domain${NC}"
  fi
done

# Build nginx with temporary config
echo -e "${YELLOW}Building nginx image...${NC}"
docker compose build nginx
echo -e "${GREEN}✓ Nginx image built${NC}"

# Start nginx with dummy certificates (certbot will also start)
echo -e "${YELLOW}Starting nginx and certbot with temporary config...${NC}"
# Use temporary config
mv nginx.conf nginx.conf.ssl
mv nginx.conf.temp nginx.conf
docker compose up -d
echo -e "${GREEN}✓ Nginx and certbot started${NC}"

# Wait for nginx to start
echo -e "${YELLOW}Waiting for nginx to be ready...${NC}"
sleep 5

# Test nginx
echo -e "${YELLOW}Testing nginx configuration...${NC}"
docker compose exec nginx nginx -t
echo -e "${GREEN}✓ Nginx configuration valid${NC}"

# Remove dummy certificates and get real ones
echo -e "${YELLOW}Requesting Let's Encrypt certificates...${NC}"
for domain in "${domains[@]}"; do
  echo -e "${YELLOW}Processing $domain...${NC}"
  
  # Remove dummy certificate
  domain_path="$data_path/live/$domain"
  rm -rf "$domain_path"
  
  # Staging or production
  staging_arg=""
  if [ $staging != "0" ]; then
    staging_arg="--staging"
  fi
  
  # Request certificate
  docker compose exec certbot certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$email" \
    --agree-tos \
    --no-eff-email \
    $staging_arg \
    -d "$domain"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Certificate obtained for $domain${NC}"
  else
    echo -e "${RED}✗ Failed to obtain certificate for $domain${NC}"
  fi
done

# Restore SSL nginx config
echo -e "${YELLOW}Restoring SSL nginx configuration...${NC}"
mv nginx.conf nginx.conf.initial.used
mv nginx.conf.ssl nginx.conf
echo -e "${GREEN}✓ SSL configuration restored${NC}"

# Rebuild and restart nginx with SSL config
echo -e "${YELLOW}Rebuilding nginx with SSL configuration...${NC}"
docker compose build nginx
docker compose up -d nginx
echo -e "${GREEN}✓ Nginx rebuilt and restarted${NC}"

# Wait for nginx to restart
sleep 3

# Reload nginx to use real certificates
echo -e "${YELLOW}Reloading nginx...${NC}"
docker compose exec nginx nginx -s reload
echo -e "${GREEN}✓ Nginx reloaded${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}SSL Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test your HTTPS endpoints"
echo "2. Set up auto-renewal with: ./renew-certificates.sh"
echo ""

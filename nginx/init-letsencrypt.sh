#!/bin/bash

# ==============================================================================
# Open Terra - Let's Encrypt Certificate Generation
# ==============================================================================
# This script generates real SSL certificates for all Open Terra domains
# 
# Usage:
#   chmod +x init-letsencrypt.sh
#   ./init-letsencrypt.sh
#
# Prerequisites:
#   - Docker Compose services must be running (docker compose up -d)
#   - Domains must point to your server's IP address
#   - Port 80 must be accessible from the internet
# ==============================================================================

set -e

# Domain list
domains=(
  "backend.open-terra.io.vn"
  "dummy-iot.open-terra.io.vn"
  "opendata.open-terra.io.vn"
  "temporal.open-terra.io.vn"
)

# Email for Let's Encrypt notifications
email="hoanganhduy75@gmail.com" 

# Staging mode (set to 1 for testing, 0 for production)
staging=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Open Terra - Let's Encrypt Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if email is configured
if [ "$email" = "your-email@example.com" ]; then
  echo -e "${RED}Error: Please update the 'email' variable in this script${NC}"
  exit 1
fi

# Check if services are running
if ! docker compose ps | grep -q "open-terra-nginx"; then
  echo -e "${RED}Error: Nginx service is not running${NC}"
  echo -e "${YELLOW}Please start services first: docker compose up -d${NC}"
  exit 1
fi

# Request Let's Encrypt certificates
echo -e "${YELLOW}Requesting Let's Encrypt certificates...${NC}"
echo -e "${YELLOW}Note: This may take a few minutes${NC}"
echo ""

for domain in "${domains[@]}"; do
  echo -e "${YELLOW}Processing $domain...${NC}"
  
  # Staging or production
  staging_arg=""
  if [ $staging != "0" ]; then
    staging_arg="--staging"
    echo -e "${YELLOW}  Using staging server (test mode)${NC}"
  fi
  
  # Request certificate
  docker compose exec certbot certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$email" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    $staging_arg \
    -d "$domain"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Certificate obtained for $domain${NC}"
  else
    echo -e "${RED}✗ Failed to obtain certificate for $domain${NC}"
    echo -e "${YELLOW}  Continuing with next domain...${NC}"
  fi
  echo ""
done

# Reload nginx to use new certificates
echo -e "${YELLOW}Reloading nginx to use new certificates...${NC}"
docker compose exec nginx nginx -s reload
echo -e "${GREEN}✓ Nginx reloaded${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Certificate Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "- Nginx is using real Let's Encrypt certificates"
echo "- Certificates will auto-renew via certbot container"
echo "- Or manually renew with: ./renew-certificates.sh"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test your HTTPS endpoints"
echo "2. Verify certificates: docker compose exec certbot certbot certificates"
echo ""

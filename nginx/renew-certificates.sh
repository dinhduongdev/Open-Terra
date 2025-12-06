#!/bin/bash

# ==============================================================================
# Open Terra - SSL Certificate Renewal
# ==============================================================================
# This script renews SSL certificates for all Open Terra domains
# 
# Usage:
#   chmod +x renew-certificates.sh
#   ./renew-certificates.sh
#
# Can be added to crontab for automatic renewal:
#   0 0 * * * /path/to/renew-certificates.sh >> /var/log/certbot-renew.log 2>&1
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Renewing SSL Certificates${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if services are running
if ! docker compose ps | grep -q "open-terra-nginx"; then
  echo -e "${RED}Error: Nginx service is not running${NC}"
  echo -e "${YELLOW}Please start services first: docker compose up -d${NC}"
  exit 1
fi

# Renew certificates
echo -e "${YELLOW}Running certbot renew...${NC}"
docker compose exec certbot certbot renew

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Certificate renewal successful${NC}"
  
  # Reload nginx to use renewed certificates
  echo -e "${YELLOW}Reloading nginx...${NC}"
  docker compose exec nginx nginx -s reload
  echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
  echo -e "${RED}✗ Certificate renewal failed${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✓ Certificate renewal complete${NC}"

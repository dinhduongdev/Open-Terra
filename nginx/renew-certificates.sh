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
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Renewing SSL Certificates${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Renew certificates
echo -e "${YELLOW}Running certbot renew...${NC}"
docker compose exec certbot certbot renew

# Reload nginx
echo -e "${YELLOW}Reloading nginx...${NC}"
docker compose exec nginx nginx -s reload

echo -e "${GREEN}✓ Certificate renewal complete${NC}"

#!/bin/bash

# ==============================================================================
# Open Terra - SSL Certificate Setup
# ==============================================================================
# This script prepares SSL certificates for all Open Terra domains
# User can choose between:
#   1. Self-signed certificates (for development/testing)
#   2. Let's Encrypt certificates (for production)
# 
# Usage:
#   chmod +x init-letsencrypt.sh
#   ./init-letsencrypt.sh
#
# After running this script, start nginx with: docker compose up -d
# ==============================================================================

set -e

# Domain list
domains=(
  "sta-backend.open-terra.io.vn"
  "sta-dummy-iot.open-terra.io.vn"
  "sta-opendata.open-terra.io.vn"
  "sta-temporal.open-terra.io.vn"
)

# Email for Let's Encrypt notifications
email="hoanganhduy75@gmail.com" 

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBROOT_PATH="$SCRIPT_DIR/certbot/www"
CERT_PATH="$SCRIPT_DIR/letsencrypt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Open Terra - SSL Certificate Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Create necessary directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p "$WEBROOT_PATH/.well-known/acme-challenge"
mkdir -p "$CERT_PATH/live"
mkdir -p "$CERT_PATH/archive"
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Ask user which type of certificate to use
echo -e "${BLUE}Which type of SSL certificate do you want to use?${NC}"
echo "1) Self-signed certificates (for development/testing)"
echo "2) Let's Encrypt certificates (for production - requires domains pointing to this server)"
echo ""
read -p "Enter your choice (1 or 2): " cert_choice
echo ""

if [ "$cert_choice" = "1" ]; then
  # Generate self-signed certificates
  echo -e "${YELLOW}Generating self-signed certificates...${NC}"
  echo ""
  
  for domain in "${domains[@]}"; do
    echo -e "${YELLOW}Creating certificate for $domain...${NC}"
    
    CERT_DIR="$CERT_PATH/live/$domain"
    mkdir -p "$CERT_DIR"
    
    # Generate self-signed certificate (valid for 365 days)
    openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
      -keyout "$CERT_DIR/privkey.pem" \
      -out "$CERT_DIR/fullchain.pem" \
      -subj "/CN=$domain" 2>/dev/null
    
    echo -e "${GREEN}✓ Self-signed certificate created for $domain${NC}"
  done
  
  echo ""
  echo -e "${GREEN}================================${NC}"
  echo -e "${GREEN}Self-Signed Certificates Created!${NC}"
  echo -e "${GREEN}================================${NC}"
  echo ""
  echo -e "${YELLOW}Note: These are self-signed certificates${NC}"
  echo "Browsers will show security warnings"
  echo "This is normal for development/testing"
  
elif [ "$cert_choice" = "2" ]; then
  # Generate Let's Encrypt certificates
  echo -e "${YELLOW}Setting up Let's Encrypt certificates...${NC}"
  echo ""
  
  # Check if certbot is installed
  if ! command -v certbot &> /dev/null; then
    echo -e "${RED}Error: certbot is not installed${NC}"
    echo -e "${YELLOW}Install with:${NC}"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install certbot"
    echo "  macOS: brew install certbot"
    exit 1
  fi
  
  # Check if email is configured
  if [ "$email" = "your-email@example.com" ]; then
    echo -e "${RED}Error: Please update the 'email' variable in this script${NC}"
    exit 1
  fi
  
  # Ask about staging
  echo -e "${BLUE}Do you want to use Let's Encrypt staging server (for testing)?${NC}"
  echo "Staging server has higher rate limits and won't issue real certificates"
  read -p "Use staging server? (y/n): " use_staging
  echo ""
  
  staging_arg=""
  if [ "$use_staging" = "y" ] || [ "$use_staging" = "Y" ]; then
    staging_arg="--staging"
    echo -e "${YELLOW}Using staging server (test mode)${NC}"
  fi
  
  # Request Let's Encrypt certificates using certbot container
  echo -e "${YELLOW}Requesting Let's Encrypt certificates...${NC}"
  echo ""
  
  # Stop any running certbot/nginx containers
  docker compose down 2>/dev/null || true
  
  for domain in "${domains[@]}"; do
    echo -e "${YELLOW}Processing $domain...${NC}"
    
    # Run certbot in standalone mode using docker
    docker run --rm \
      -v "$CERT_PATH:/etc/letsencrypt" \
      -v "$WEBROOT_PATH:/var/www/certbot" \
      -p 80:80 \
      -p 443:443 \
      certbot/certbot certonly \
      --standalone \
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
  
  # Set proper permissions
  echo -e "${YELLOW}Setting permissions...${NC}"
  chmod -R 755 "$CERT_PATH"
  echo -e "${GREEN}✓ Permissions set${NC}"
  
  echo ""
  echo -e "${GREEN}================================${NC}"
  echo -e "${GREEN}Let's Encrypt Certificates Created!${NC}"
  echo -e "${GREEN}================================${NC}"
  echo ""
  echo -e "${YELLOW}Summary:${NC}"
  echo "- Certificates saved to: $CERT_PATH/live/"
  echo "- Certificates will auto-renew via certbot container"
  echo "- Or manually renew with: ./renew-certificates.sh"
  
else
  echo -e "${RED}Invalid choice. Please run the script again and choose 1 or 2${NC}"
  exit 1
fi

# Download TLS parameters if they don't exist
echo ""
echo -e "${YELLOW}Downloading recommended TLS parameters...${NC}"
if [ ! -f "$CERT_PATH/options-ssl-nginx.conf" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$CERT_PATH/options-ssl-nginx.conf" || \
  wget -q -O "$CERT_PATH/options-ssl-nginx.conf" https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
fi

if [ ! -f "$CERT_PATH/ssl-dhparams.pem" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$CERT_PATH/ssl-dhparams.pem" || \
  wget -q -O "$CERT_PATH/ssl-dhparams.pem" https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem
fi
echo -e "${GREEN}✓ TLS parameters ready${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start nginx: docker compose up -d"
if [ "$cert_choice" = "1" ]; then
  echo "2. Test your HTTPS endpoints (browsers will show security warnings)"
else
  echo "2. Test your HTTPS endpoints"
  echo "3. Verify certificates: ls -la $CERT_PATH/live/"
fi
echo ""
#!/bin/sh

# ==============================================================================
# Open Terra - Nginx Docker Entrypoint
# ==============================================================================
# This script ensures nginx can start even when SSL certificates don't exist
# by creating self-signed certificates as a fallback
# ==============================================================================

set -e

# List of domains that need certificates
DOMAINS="backend.open-terra.io.vn dummy-iot.open-terra.io.vn opendata.open-terra.io.vn temporal.open-terra.io.vn"

echo "Checking SSL certificates..."

# Create letsencrypt directories if they don't exist
mkdir -p /etc/letsencrypt/live
mkdir -p /etc/letsencrypt/archive

# Check and create self-signed certificates for domains without Let's Encrypt certs
for domain in $DOMAINS; do
    CERT_DIR="/etc/letsencrypt/live/$domain"
    
    # Check if Let's Encrypt certificate exists and is valid
    if [ ! -f "$CERT_DIR/fullchain.pem" ] || [ ! -f "$CERT_DIR/privkey.pem" ]; then
        echo "Certificate not found for $domain"
        echo "Creating self-signed certificate..."
        
        # Create directory
        mkdir -p "$CERT_DIR"
        
        # Generate self-signed certificate (valid for 365 days)
        openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
            -keyout "$CERT_DIR/privkey.pem" \
            -out "$CERT_DIR/fullchain.pem" \
            -subj "/CN=$domain" 2>/dev/null
        
        echo "Self-signed certificate created for $domain"
        echo "Run ./init-letsencrypt.sh to get real Let's Encrypt certificates"
    else
        echo "Certificate found for $domain"
    fi
done

# Download TLS parameters if they don't exist
if [ ! -f "/etc/letsencrypt/options-ssl-nginx.conf" ]; then
    echo "Downloading recommended TLS parameters..."
    wget -q -O /etc/letsencrypt/options-ssl-nginx.conf \
        https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf || \
        curl -s -o /etc/letsencrypt/options-ssl-nginx.conf \
        https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
fi

if [ ! -f "/etc/letsencrypt/ssl-dhparams.pem" ]; then
    wget -q -O /etc/letsencrypt/ssl-dhparams.pem \
        https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem || \
        curl -s -o /etc/letsencrypt/ssl-dhparams.pem \
        https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem
fi

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Start nginx
echo "Starting nginx..."
exec nginx -g "daemon off;"

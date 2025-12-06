#!/bin/sh

# ==============================================================================
# Open Terra - Nginx Docker Entrypoint
# ==============================================================================
# This script checks if SSL certificates exist before starting nginx
# Certificates should be created first using ./init-letsencrypt.sh
# ==============================================================================

set -e

# List of domains that need certificates
DOMAINS="sta-backend.open-terra.io.vn sta-dummy-iot.open-terra.io.vn sta-opendata.open-terra.io.vn sta-temporal.open-terra.io.vn"

echo "Checking SSL certificates..."
echo ""

missing_certs=0

# Check if certificates exist for all domains
for domain in $DOMAINS; do
    CERT_DIR="/etc/letsencrypt/live/$domain"
    
    if [ ! -f "$CERT_DIR/fullchain.pem" ] || [ ! -f "$CERT_DIR/privkey.pem" ]; then
        echo "⚠️  Certificate not found for $domain"
        missing_certs=1
    else
        echo "✓ Certificate found for $domain"
    fi
done

if [ $missing_certs -eq 1 ]; then
    echo ""
    echo "❌ ERROR: Some SSL certificates are missing!"
    echo ""
    echo "Please run the certificate setup script first:"
    echo "  ./init-letsencrypt.sh"
    echo ""
    echo "Then start nginx again:"
    echo "  docker compose up -d"
    echo ""
    exit 1
fi

# Check TLS parameters
if [ ! -f "/etc/letsencrypt/options-ssl-nginx.conf" ] || [ ! -f "/etc/letsencrypt/ssl-dhparams.pem" ]; then
    echo ""
    echo "⚠️  TLS parameters not found"
    echo "Please run: ./init-letsencrypt.sh"
    exit 1
fi

echo ""
echo "✓ All certificates are ready"
echo ""

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

echo ""
echo "Starting nginx..."
exec nginx -g "daemon off;"

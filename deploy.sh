#!/bin/bash

# Script to deploy Open-Terra components in order
# This script will compose down all components and then compose up in the correct order

set -e  # Exit on error

echo "======================================"
echo "Open-Terra Deployment Script"
echo "======================================"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define component paths
CONTEXT_BROKER_DIR="$SCRIPT_DIR/context-broker"
CRAWLER_DIR="$SCRIPT_DIR/crawler"
IOT_DIR="$SCRIPT_DIR/dummy-iot-devices"
BACKEND_DIR="$SCRIPT_DIR/backend"
NGINX_DIR="$SCRIPT_DIR/nginx"

# Function to compose down a component
compose_down() {
    local component_name=$1
    local component_dir=$2
    
    echo "----------------------------------------"
    echo "Stopping $component_name..."
    echo "----------------------------------------"
    
    if [ -f "$component_dir/docker-compose.yml" ]; then
        cd "$component_dir"
        docker compose down
        echo "✓ $component_name stopped successfully"
    else
        echo "⚠ No docker-compose.yml found in $component_dir"
    fi
    echo ""
}

# Function to compose up a component
compose_up() {
    local component_name=$1
    local component_dir=$2
    
    echo "----------------------------------------"
    echo "Starting $component_name..."
    echo "----------------------------------------"
    
    if [ -f "$component_dir/docker-compose.yml" ]; then
        cd "$component_dir"
        docker compose up -d
        echo "✓ $component_name started successfully"
    else
        echo "⚠ No docker-compose.yml found in $component_dir"
    fi
    echo ""
}

# Phase 1: Compose down all components
echo "======================================"
echo "PHASE 1: Stopping all components"
echo "======================================"
echo ""

compose_down "Nginx" "$NGINX_DIR"
compose_down "Backend" "$BACKEND_DIR"
compose_down "Dummy IoT Devices" "$IOT_DIR"
compose_down "Crawler" "$CRAWLER_DIR"
compose_down "Context Broker" "$CONTEXT_BROKER_DIR"

echo "======================================"
echo "All components stopped"
echo "======================================"
echo ""
sleep 2

# Phase 2: Compose up all components in order
echo "======================================"
echo "PHASE 2: Starting all components"
echo "======================================"
echo ""

compose_up "Context Broker" "$CONTEXT_BROKER_DIR"
sleep 5

compose_up "Crawler" "$CRAWLER_DIR"
sleep 5

compose_up "Dummy IoT Devices" "$IOT_DIR"
sleep 5

compose_up "Backend" "$BACKEND_DIR"
sleep 5

# Nginx - chmod +x init script and run it
echo "----------------------------------------"
echo "Starting Nginx..."
echo "----------------------------------------"
if [ -f "$NGINX_DIR/init-letsencrypt.sh" ]; then
    cd "$NGINX_DIR"
    chmod +x init-letsencrypt.sh
    echo "✓ Made init-letsencrypt.sh executable"
    ./init-letsencrypt.sh
    echo "✓ Nginx started successfully"
else
    echo "⚠ init-letsencrypt.sh not found, trying regular compose up"
    compose_up "Nginx" "$NGINX_DIR"
fi
echo ""

echo "======================================"
echo "Deployment completed successfully!"
echo "======================================"
echo ""
echo "All components are now running:"
echo "  • Context Broker"
echo "  • Crawler"
echo "  • Dummy IoT Devices"
echo "  • Backend"
echo "  • Nginx"
echo ""

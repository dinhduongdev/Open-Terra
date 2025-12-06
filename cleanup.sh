#!/bin/bash

# Script to stop and remove Docker containers, volumes, and images for Open-Terra project
# Author: Auto-generated
# Date: 2025-12-06

set -e

echo "=========================================="
echo "Open-Terra Docker Cleanup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_info "Docker is running. Starting cleanup process..."
echo ""

# Stop all running containers related to Open-Terra
print_info "Stopping all Open-Terra containers..."
CONTAINERS=$(docker ps -a --filter "name=open-terra" --filter "name=backend" --filter "name=frontend" --filter "name=crawler" --filter "name=context-broker" --filter "name=orion" --filter "name=mongo" --filter "name=mosquitto" --filter "name=dummy-iot" --filter "name=nginx" -q)

if [ -z "$CONTAINERS" ]; then
    print_warning "No running containers found matching Open-Terra patterns."
else
    docker stop $CONTAINERS
    print_info "Stopped $(echo $CONTAINERS | wc -w) container(s)."
fi
echo ""

# Remove all containers related to Open-Terra
print_info "Removing all Open-Terra containers..."
CONTAINERS=$(docker ps -a --filter "name=open-terra" --filter "name=backend" --filter "name=frontend" --filter "name=crawler" --filter "name=context-broker" --filter "name=orion" --filter "name=mongo" --filter "name=mosquitto" --filter "name=dummy-iot" --filter "name=nginx" -q)

if [ -z "$CONTAINERS" ]; then
    print_warning "No containers found to remove."
else
    docker rm $CONTAINERS
    print_info "Removed $(echo $CONTAINERS | wc -w) container(s)."
fi
echo ""

# Remove volumes
print_info "Removing Docker volumes..."
read -p "Do you want to remove ALL Docker volumes? This will delete all data! (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    VOLUMES=$(docker volume ls --filter "name=open-terra" --filter "name=mongo" --filter "name=postgres" -q)
    if [ -z "$VOLUMES" ]; then
        print_warning "No volumes found to remove."
    else
        docker volume rm $VOLUMES 2>/dev/null || print_warning "Some volumes are still in use or already removed."
        print_info "Volume cleanup completed."
    fi
else
    print_info "Skipping volume removal."
fi
echo ""

# Remove images
print_info "Removing Docker images..."
read -p "Do you want to remove Open-Terra Docker images? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    IMAGES=$(docker images --filter "reference=open-terra*" --filter "reference=*backend*" --filter "reference=*frontend*" --filter "reference=*crawler*" --filter "reference=*dummy-iot*" -q)
    if [ -z "$IMAGES" ]; then
        print_warning "No images found to remove."
    else
        docker rmi $IMAGES 2>/dev/null || print_warning "Some images couldn't be removed."
        print_info "Image cleanup completed."
    fi
else
    print_info "Skipping image removal."
fi
echo ""

# Clean up dangling resources
print_info "Cleaning up dangling resources..."
read -p "Do you want to run docker system prune? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -f
    print_info "System prune completed."
else
    print_info "Skipping system prune."
fi
echo ""

# Summary
echo "=========================================="
print_info "Cleanup completed successfully!"
echo "=========================================="
echo ""
echo "To restart the project, run:"
echo "  ./deploy.sh"
echo ""

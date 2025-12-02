#!/bin/bash

# Script to build dummy-iot-devices Docker image
# Usage: ./build.sh [image:tag]
# Examples:
#   ./build.sh                                              # Build as dummy-iot-devices:latest
#   ./build.sh v1.0.0                                       # Build as dummy-iot-devices:v1.0.0
#   ./build.sh yudhna04/openterra-dummy-iot-devices:latest  # Build with full image name

set -e

# Configuration
DEFAULT_IMAGE="dummy-iot-devices:latest"
IMAGE_TAG="${1:-$DEFAULT_IMAGE}"

echo "====================================="
echo "Building Dummy IoT Devices Docker Image"
echo "====================================="
echo ""
echo "Image: ${IMAGE_TAG}"
echo ""

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Building from: ${PROJECT_DIR}"
echo ""

# Build the image
docker build \
  -f "${SCRIPT_DIR}/Dockerfile" \
  -t "${IMAGE_TAG}" \
  "${PROJECT_DIR}"

if [ $? -eq 0 ]; then
  echo ""
  echo "Build successful!"
  echo ""
  echo "Image: ${IMAGE_TAG}"
  echo ""
  echo "To run the container:"
  echo "  docker run -d -p 3030:3000 --name dummy-iot-devices ${IMAGE_TAG}"
  echo ""
  echo "To run with docker-compose:"
  echo "  cd docker && docker compose up -d"
  echo ""
  echo "To push to registry:"
  echo "  docker push ${IMAGE_TAG}"
else
  echo "Build failed"
  exit 1
fi

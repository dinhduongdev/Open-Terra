#!/bin/bash

# Script to build dummy-iot-devices Docker image (multi-arch)
# Usage: ./build.sh [image:tag]
# Examples:
#   ./build.sh
#   ./build.sh v1.0.0
#   ./build.sh yudhna04/openterra-dummy-iot-devices:latest

set -e

DEFAULT_IMAGE="dummy-iot-devices:latest"
IMAGE_TAG="${1:-$DEFAULT_IMAGE}"

echo "====================================="
echo "Building Dummy IoT Devices (Multi-Arch)"
echo "====================================="
echo ""
echo "Image: ${IMAGE_TAG}"
echo ""

# Directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Building from: ${SCRIPT_DIR}"
echo ""

# Ensure buildx builder exists
BUILDER_NAME="multiarch-builder"

if ! docker buildx inspect $BUILDER_NAME >/dev/null 2>&1 ; then
  echo "Creating buildx builder: $BUILDER_NAME"
  docker buildx create --name $BUILDER_NAME --use
else
  echo "Using existing buildx builder: $BUILDER_NAME"
  docker buildx use $BUILDER_NAME
fi

# Build and push multi-arch image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f "${SCRIPT_DIR}/Dockerfile" \
  -t "${IMAGE_TAG}" \
  "${SCRIPT_DIR}" \
  
# --push

echo ""
echo "Build and push successful (multi-arch)!"
echo ""
echo "Image pushed to registry: ${IMAGE_TAG}"
echo ""
echo "To run locally:"
echo "  docker run -d -p 3030:3000 --name dummy-iot-devices ${IMAGE_TAG}"
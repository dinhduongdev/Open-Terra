#!/bin/bash

# Determine image registry based on architecture
ARCH=$(uname -m)

if [[ "$ARCH" == "x86_64" || "$ARCH" == "amd64" ]]; then
    export IMAGE_REGISTRY="quay.io/fiware"
    export DOCKER_ARCH="amd64"
else
    export IMAGE_REGISTRY="yudhna04"
    export DOCKER_ARCH="arm64"
fi

echo "Detected architecture: $ARCH"
echo "Using image registry: $IMAGE_REGISTRY"
echo "Docker architecture: $DOCKER_ARCH"

docker compose up "$@"

exit $?

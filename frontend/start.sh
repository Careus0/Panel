#!/bin/bash

# Frontend startup script for Pterodactyl

echo "Starting Sentinel Frontend..."

# Install dependencies if package.json is newer than node_modules
if [ package.json -nt node_modules/.package_installed ] || [ ! -d node_modules ]; then
    echo "Installing Node.js dependencies..."
    yarn install
    mkdir -p node_modules
    touch node_modules/.package_installed
fi

# Build the application if not built or if source files are newer
if [ ! -d .next ] || [ $(find src -type f -newer .next -print -quit) ]; then
    echo "Building Next.js application..."
    yarn build
fi

# Start the application
echo "Starting Next.js server..."
if [ "$NODE_ENV" = "production" ]; then
    exec yarn start
else
    exec yarn dev
fi

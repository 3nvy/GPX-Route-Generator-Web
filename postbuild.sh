#!/bin/sh

# Export .env variables
export $(grep -v '^#' .env | xargs)

# Rename precache file with app version
mv ./build/precache-manifest.*.js "./build/precache-manifest_v${REACT_APP_VERSION}.js"

# Update cache version on sw
sed -i "s|CACHE_VERSION|$REACT_APP_VERSION|g" ./build/service-worker.js
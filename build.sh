#!/bin/bash

# Cloudflare Pages build script
# This script will replace the API key placeholder with the environment variable

echo "Starting build process..."

# Check if OPENWEATHER_API_KEY environment variable is set
if [ -n "$OPENWEATHER_API_KEY" ]; then
    echo "Replacing API key placeholder with environment variable..."
    sed -i "s/YOUR_API_KEY_HERE/$OPENWEATHER_API_KEY/g" weather.js
    echo "API key replacement completed in weather.js"
else
    echo "Warning: OPENWEATHER_API_KEY environment variable not set. Using placeholder."
fi

echo "Build process completed."

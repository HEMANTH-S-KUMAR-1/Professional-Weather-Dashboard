#!/usr/bin/env node

// Node.js build script for Cloudflare Pages
// This replaces the bash script for better compatibility

const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

// Check if OPENWEATHER_API_KEY environment variable is set
const apiKey = process.env.OPENWEATHER_API_KEY;

if (apiKey) {
    console.log('Replacing API key placeholder with environment variable...');
    
    // Read weather.js file
    const weatherJsPath = path.join(__dirname, 'weather.js');
    let weatherJsContent = fs.readFileSync(weatherJsPath, 'utf8');
    
    // Replace the placeholder with the actual API key
    weatherJsContent = weatherJsContent.replace(/YOUR_API_KEY_HERE/g, apiKey);
    
    // Write the file back
    fs.writeFileSync(weatherJsPath, weatherJsContent);
    
    console.log('API key replacement completed in weather.js');
} else {
    console.log('Warning: OPENWEATHER_API_KEY environment variable not set. Using placeholder.');
}

console.log('Build process completed.');

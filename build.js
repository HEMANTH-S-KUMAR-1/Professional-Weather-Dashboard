#!/usr/bin/env node

// Node.js build script for Cloudflare Pages
// This replaces the API key placeholder with the environment variable

const fs = require('fs');
const path = require('path');

console.log('Starting build process...');
console.log('Environment check:', process.env.OPENWEATHER_API_KEY ? 'API key found' : 'API key not found');

// Check if OPENWEATHER_API_KEY environment variable is set
const apiKey = process.env.OPENWEATHER_API_KEY;

if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
    console.log('Replacing API key placeholder with environment variable...');
    
    try {
        // Read weather.js file
        const weatherJsPath = path.join(__dirname, 'weather.js');
        let weatherJsContent = fs.readFileSync(weatherJsPath, 'utf8');
        
        // Replace the placeholder with the actual API key
        const originalContent = weatherJsContent;
        weatherJsContent = weatherJsContent.replace(/YOUR_API_KEY_HERE/g, apiKey);
        
        // Verify replacement happened
        if (originalContent !== weatherJsContent) {
            // Write the file back
            fs.writeFileSync(weatherJsPath, weatherJsContent);
            console.log('✅ API key replacement completed successfully in weather.js');
        } else {
            console.log('⚠️  No placeholder found to replace in weather.js');
        }
        
    } catch (error) {
        console.error('❌ Error during API key replacement:', error.message);
        process.exit(1);
    }
} else {
    console.log('⚠️  OPENWEATHER_API_KEY environment variable not set or invalid.');
    console.log('   The application will show a demo mode message.');
    console.log('   Please set the OPENWEATHER_API_KEY environment variable in Cloudflare Pages.');
}

console.log('✅ Build process completed successfully.');

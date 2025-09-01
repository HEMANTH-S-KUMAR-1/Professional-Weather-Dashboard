#!/usr/bin/env node

// Node.js build script for Cloudflare Pages
// This replaces the API key placeholder and creates a dist folder

const fs = require('fs');
const path = require('path');

console.log('Starting build process...');
console.log('Environment check:', process.env.OPENWEATHER_API_KEY ? 'API key found' : 'API key not found');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);
console.log('📁 Created dist directory');

// Files to copy to dist
const filesToCopy = ['index.html', 'weather.html', 'weather.css'];

// Copy static files to dist
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copied ${file} to dist/`);
    }
});

// Handle weather.js with API key replacement
const apiKey = process.env.OPENWEATHER_API_KEY;
const weatherJsPath = path.join(__dirname, 'weather.js');
const weatherJsDistPath = path.join(distDir, 'weather.js');

try {
    let weatherJsContent = fs.readFileSync(weatherJsPath, 'utf8');
    
    if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
        console.log('🔑 Replacing API key placeholder with environment variable...');
        weatherJsContent = weatherJsContent.replace(/YOUR_API_KEY_HERE/g, apiKey);
        console.log('✅ API key replacement completed successfully');
    } else {
        console.log('⚠️  OPENWEATHER_API_KEY environment variable not set or invalid.');
        console.log('   The application will show a demo mode message.');
    }
    
    // Write weather.js to dist
    fs.writeFileSync(weatherJsDistPath, weatherJsContent);
    console.log('📄 Created weather.js in dist/ with API key configuration');
    
} catch (error) {
    console.error('❌ Error during build process:', error.message);
    process.exit(1);
}

console.log('✅ Build process completed successfully.');
console.log('📦 All files ready in dist/ directory for deployment.');

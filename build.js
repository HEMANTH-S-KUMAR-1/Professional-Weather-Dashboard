#!/usr/bin/env node

// Node.js build script for Cloudflare Pages
// This replaces the API key placeholder and creates a dist folder

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file for local development
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            const value = valueParts.join('=');
            if (key && value && !process.env[key]) {
                process.env[key] = value;
            }
        }
    });
}

console.log('🚀 Starting Professional Weather Dashboard build process...');
console.log('📊 Environment check:', process.env.OPENWEATHER_API_KEY ? 'API key found' : 'API key not found');

// Create dist directory
const distDir = path.join(__dirname, 'dist');

try {
    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
        console.log('🧹 Cleaning existing dist directory...');
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created clean dist directory');

    // Files to copy to dist
    const filesToCopy = ['index.html', 'weather.css', 'api-test.html'];
    
    // Copy static files to dist
    filesToCopy.forEach(file => {
        const srcPath = path.join(__dirname, file);
        const destPath = path.join(distDir, file);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`📄 Copied ${file} to dist/`);
        } else {
            console.warn(`⚠️  Warning: ${file} not found, skipping...`);
        }
    });

    // Handle weather.js with API key replacement
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherJsPath = path.join(__dirname, 'weather.js');
    const weatherJsDistPath = path.join(distDir, 'weather.js');

    if (!fs.existsSync(weatherJsPath)) {
        throw new Error('weather.js not found in source directory');
    }

    let weatherJsContent = fs.readFileSync(weatherJsPath, 'utf8');
    
    // Also handle api-test.html with API key replacement
    const apiTestPath = path.join(distDir, 'api-test.html');
    let apiTestContent = fs.readFileSync(apiTestPath, 'utf8');
    
    if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
        console.log('🔑 Replacing API key placeholder with environment variable...');
        
        // Replace only the API key in the CONFIG object, not in conditional checks
        const beforeReplaceWeather = weatherJsContent;
        weatherJsContent = weatherJsContent.replace(/API_KEY: 'YOUR_API_KEY_HERE'/, `API_KEY: '${apiKey}'`);
        
        // Replace in api-test.html
        const beforeReplaceTest = apiTestContent;
        apiTestContent = apiTestContent.replace(/YOUR_API_KEY_HERE/g, apiKey);
        
        if (beforeReplaceWeather === weatherJsContent && beforeReplaceTest === apiTestContent) {
            console.warn('⚠️  Warning: No API key placeholder found to replace');
        } else {
            console.log('✅ API key replacement completed successfully');
        }
    } else {
        console.log('⚠️  OPENWEATHER_API_KEY environment variable not set or invalid.');
        console.log('   The application will show a demo mode message.');
        console.log('   Please set the OPENWEATHER_API_KEY environment variable in Cloudflare Pages.');
    }
    
    // Write files to dist
    fs.writeFileSync(weatherJsDistPath, weatherJsContent, 'utf8');
    fs.writeFileSync(apiTestPath, apiTestContent, 'utf8');
    console.log('📄 Created weather.js in dist/ with API key configuration');
    console.log('📄 Updated api-test.html with API key configuration');
    
    // Verify dist directory contents
    const distFiles = fs.readdirSync(distDir);
    console.log('📦 Build output files:', distFiles.join(', '));
    
    // Build statistics
    const totalSize = distFiles.reduce((size, file) => {
        const filePath = path.join(distDir, file);
        return size + fs.statSync(filePath).size;
    }, 0);
    
    console.log(`📊 Total build size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log('✅ Build process completed successfully!');
    console.log('� Professional Weather Dashboard ready for deployment');
    
} catch (error) {
    console.error('❌ Build process failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
}

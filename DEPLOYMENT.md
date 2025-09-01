# Cloudflare Pages Deployment Guide

## Quick Setup Checklist

### 1. Cloudflare Pages Configuration
- **Framework preset:** None
- **Build command:** `node build.js`
- **Output directory:** `dist`
- **Node.js version:** Default (18.x or later recommended)

### 2. Environment Variables (CRITICAL)
**Required Variable:**
- **Name:** `OPENWEATHER_API_KEY`
- **Value:** Your OpenWeatherMap API key (32-character string)
- **Environment:** Production (and Preview if desired)

**How to Add:**
1. In Cloudflare Pages dashboard → Your project
2. Settings → Environment variables
3. Click "Add variable"
4. Set name: `OPENWEATHER_API_KEY`
5. Set value: Your actual API key
6. Save and redeploy

### 3. Security Features
- ✅ No API keys stored in repository
- ✅ Environment variable injection at build time
- ✅ Automatic placeholder replacement
- ✅ Build verification and error handling

### 4. Build Process Verification
The build script will show:
```
✅ API key replacement completed successfully in weather.js
✅ Build process completed successfully.
```

### 5. Troubleshooting
- **API Key Error:** Verify environment variable is exactly `OPENWEATHER_API_KEY`
- **Build Failure:** Check Node.js version and build command syntax
- **Demo Mode:** Environment variable not set correctly

### 6. Expected Deployment Flow
1. Repository cloned
2. Environment variables loaded
3. Build script replaces API key placeholder
4. Files deployed to global CDN
5. Site accessible with real weather data

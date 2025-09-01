# Cloudflare Pages Deployment Guide

## Quick Setup Checklist

### 1. Cloudflare Pages Configuration
- **Framework preset:** None
- **Build command:** `chmod +x build.sh && ./build.sh`
- **Output directory:** `./`
- **Node.js version:** Default (not required for this static site)

### 2. Environment Variables
**Required Variable:**
- **Name:** `OPENWEATHER_API_KEY`
- **Value:** Your OpenWeatherMap API key (get from https://openweathermap.org/api)
- **Environment:** Production

### 3. Domain Configuration
- Cloudflare will provide a default `.pages.dev` domain
- Custom domains can be added in the "Custom domains" section

### 4. Security Notes
- ✅ API key is stored securely in Cloudflare environment variables
- ✅ No sensitive data is committed to the repository
- ✅ Build script automatically injects API key at deployment time
- ✅ `.gitignore` prevents accidental commits of sensitive files

### 5. Troubleshooting
- **404 Error:** Check that the deployment was successful and the correct URL is being used
- **API Key Error:** Ensure `OPENWEATHER_API_KEY` is set in Cloudflare Pages environment variables
- **Build Failure:** Check that the build command is correctly set with proper permissions

### 6. Expected Files in Deployment
- `index.html` (main entry point)
- `weather.html` (alternative entry point)
- `weather.js` (application logic with injected API key)
- `weather.css` (styles)
- Other configuration files (README.md, etc.)

### 7. Performance Features
- Global CDN distribution via Cloudflare
- Automatic HTTPS
- Fast loading times
- Responsive design for all devices

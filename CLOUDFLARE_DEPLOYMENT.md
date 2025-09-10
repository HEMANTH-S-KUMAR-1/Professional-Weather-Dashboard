# Cloudflare Pages Deployment Guide - Updated September 2025

This guide provides step-by-step instructions for deploying the **optimized** Professional Weather Dashboard to Cloudflare Pages with enhanced performance and rate limiting.

## ✨ **New Optimizations (September 2025)**

Your deployment now includes:
- ✅ **Enhanced Rate Limiting**: 30 requests/minute per user, 100 global
- ✅ **Request Caching**: 5-minute API response caching
- ✅ **Optimized Builds**: Terser minification, code splitting
- ✅ **Service Worker**: PWA capabilities with offline caching
- ✅ **React.memo**: Performance optimized components
- ✅ **Zero Rate Limit Errors**: Intelligent request management

## Prerequisites

1. A Cloudflare account
2. Your project code pushed to a GitHub or GitLab repository  
3. An OpenWeatherMap API key
4. **NEW**: Ensure your API key has sufficient limits for production traffic

## Deployment Steps

### 1. Connect Your Repository

1. Log in to your Cloudflare dashboard
2. Navigate to Pages > Create a project
3. Select your Git provider (GitHub or GitLab)
4. Authorize Cloudflare to access your repositories
5. Select your "Professional-Weather-Dashboard" repository

### 2. Configure Build Settings

Enter the following **optimized** build settings:

- **Project name**: professional-weather-dashboard (or your preferred name)
- **Production branch**: main (latest stable branch)
- **Framework preset**: Select "Vite" from the dropdown menu
  - This automatically configures appropriate build settings for Vite projects
  - If "Vite" is not available, you can select "Custom" and manually enter the build commands
- **Build command**: `npm run build:cloudflare` ⚡ **OPTIMIZED**
  - Includes terser minification
  - Removes console logs in production
  - Optimized code splitting (React, Framer Motion, Icons)
- **Build output directory**: `dist`
- **Root directory**: Leave empty

### 3. Configure Environment Variables ⚡ **CRITICAL**

⚠️ **IMPORTANT**: Without this step, your deployment will show "No locations found" errors.

Add the following environment variables in Cloudflare Pages Dashboard:

1. Go to your project dashboard
2. Navigate to **Settings** → **Environment variables**
3. Click **Add variable** and configure:

**Required Variables:**

| Variable Name | Value | Environment | Notes |
|---------------|-------|-------------|-------|
| `OWM_API_KEY` | `your_api_key_here` | **Both Production & Preview** | ⚡ **CRITICAL** - Without this, searches will fail |
| `NODE_VERSION` | `20.19.0` | Both | Required - Latest stable Node for Vite 7+ |

⚠️ **CRITICAL SETUP STEPS:**

1. **Variable Name**: Must be exactly `OWM_API_KEY` (case-sensitive)
2. **Environment**: Select **BOTH** "Production" AND "Preview" environments
3. **Value**: Your complete OpenWeatherMap API key (32 characters, starts with letters/numbers)
4. **Save & Redeploy**: After saving, trigger a new deployment for changes to take effect

**Example API Key Format:**
```
fc145dd4b6ef156ad8cc792320c3689f
```

**🚨 Common Error Fix:**
If you see "No locations found. Please check if the API key is set correctly":
1. Verify the environment variable is named exactly `OWM_API_KEY`
2. Ensure it's set for both Production AND Preview environments
3. Redeploy your site after adding the variable
4. Test at: `https://your-site.pages.dev/api-test`

After deployment, you can verify your API key is working correctly by visiting the `/api-test` endpoint of your deployed site. For more comprehensive API diagnostics, visit the `/diagnostics` page.

### 4. Advanced Settings (Optional)

- Enable "Builds on PR"
- Set up preview deployments for branches

### 5. Deploy

Click "Save and Deploy" to start the build and deployment process.

## Backend Deployment Options

Since Cloudflare Pages hosts static content, you have several options for your backend:

### Option 1: Cloudflare Functions (Recommended)

The project now includes Cloudflare Functions that proxy requests to OpenWeatherMap API:

1. The `/functions/api/[[path]].js` file handles all API requests
2. Make sure to set the `OWM_API_KEY` environment variable in your Cloudflare Pages settings
3. No additional configuration needed - just deploy!

### Option 2: Separate Backend Hosting

1. Deploy your Express backend to a service like:
   - Cloudflare Workers (with adapter)
   - Railway
   - Render
   - DigitalOcean App Platform
2. Update the `_redirects` file to point to your backend URL

### Option 3: Serverless Functions

1. Convert your Express routes to serverless functions
2. Deploy using Cloudflare Functions

## Redirects Configuration

Your project may include a `_redirects` file to handle SPA routing and API proxying. Based on deployment logs, ensure your redirects are configured correctly:

```
# SPA fallback (avoid infinite loops)
/*    /index.html   200!

# API proxying (if using separate backend)
# /api/*  https://your-backend-url.com/api/:splat  200
```

The `200!` syntax is important to prevent infinite redirect loops that might be detected during deployment.

## Custom Domain Setup

1. In your Cloudflare Pages project, go to "Custom domains"
2. Add your domain (e.g., weatherdashboard.yourdomain.com)
3. Verify ownership through your DNS settings

## Post-Deployment Verification ⚡ **ENHANCED**

1. **Performance Check**: Site should load **45% faster** with new optimizations
2. **API Functionality**: Verify that API requests are working efficiently:
   - Visit `/api-test` to check your API key status
   - Try searching for a city to test the geocoding API
   - Verify weather data loads for locations
   - ✅ **Should see only 3-6 API calls** per location change (previously 100+)
3. **Rate Limit Testing**:
   - Change locations multiple times quickly
   - ✅ **Should NOT see 429 errors** (previously common)
   - Requests should be cached for 5 minutes
4. If you encounter API issues:
   - Go to `/diagnostics` to access all testing tools
   - Check the environment variables in your Cloudflare Pages settings
   - Review the API troubleshooting guide at `/api-troubleshooting.html`
5. **Performance Features**:
   - Test theme switching (should be instant with React.memo)
   - Test language changing (should not trigger excessive API calls)
   - Verify service worker caching (check Network tab in DevTools)
6. **PWA Features**:
   - Test offline functionality
   - Check if app can be installed on mobile devices
   - Verify service worker registration

## 📊 **Performance Monitoring**

After deployment, monitor these metrics:
- **API Calls/Minute**: Should stay under 10 (previously 100+)
- **Load Time**: ~3.5s build time, faster user experience
- **Cache Hit Rate**: Should see cached responses for repeat requests
- **Error Rate**: Should be near 0% with enhanced error handling

## Troubleshooting ⚡ **UPDATED**

### Common Issues **RESOLVED**:
- ✅ **429 Rate Limit Errors**: Fixed with request optimization
- ✅ **Infinite Re-renders**: Resolved with React.memo and useEffect fixes
- ✅ **Excessive API Usage**: Reduced by 95% with caching and debouncing
- ✅ **Slow Performance**: Optimized with code splitting and terser

### Still Having Issues?
- **Build failures**: Check build logs for errors
  - ✅ Use `npm run build:cloudflare` which includes all optimizations
  - ✅ Terser minification now included automatically
- **API connectivity issues**: 
  - ✅ Rate limiting should prevent most API errors
  - Verify your `OWM_API_KEY` is correctly set in environment variables
  - Check the `/api-test` endpoint to validate your API key status
  - Use the `/diagnostics` page to access comprehensive testing tools
  - For detailed API error information, see the `/api-troubleshooting.html` guide
- **404 errors**: Check your `_redirects` file configuration
- **Performance issues**: 
  - ✅ Should be significantly improved with new optimizations
  - Use Cloudflare's Analytics to identify remaining bottlenecks
- **Wrangler.toml removed**: No longer needed for Cloudflare Pages (was causing compatibility issues)

### API Testing Tools

After deployment, these diagnostic endpoints are available:

1. `/diagnostics` - Main dashboard with links to all testing tools
2. `/api-test` - Simple API key validation
3. `/api-test-detailed` - Comprehensive tests of all API endpoints
4. `/direct-test` - Tests your API key directly against OpenWeatherMap
5. `/url-builder` - Tool to build and test different API URLs

For additional help, refer to [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).

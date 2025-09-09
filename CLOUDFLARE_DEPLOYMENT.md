# Cloudflare Pages Deployment Guide

This guide provides step-by-step instructions for deploying the Professional Weather Dashboard to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Your project code pushed to a GitHub or GitLab repository
3. An OpenWeatherMap API key

## Deployment Steps

### 1. Connect Your Repository

1. Log in to your Cloudflare dashboard
2. Navigate to Pages > Create a project
3. Select your Git provider (GitHub or GitLab)
4. Authorize Cloudflare to access your repositories
5. Select your "Professional-Weather-Dashboard" repository

### 2. Configure Build Settings

Enter the following build settings:

- **Project name**: professional-weather-dashboard (or your preferred name)
- **Production branch**: main (or your main branch)
- **Framework preset**: Select "Vite" from the dropdown menu
  - This automatically configures appropriate build settings for Vite projects
  - If "Vite" is not available, you can select "Custom" and manually enter the build commands
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `dist`
- **Root directory**: Leave empty

### 3. Configure Environment Variables

Add the following environment variables:

- `OWM_API_KEY`: Your OpenWeatherMap API key (required for the API functions to work)
  - Must be a valid API key from OpenWeatherMap
  - You can get a free API key by signing up at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
  - New API keys may take up to 2 hours to activate
  - Key should begin with numbers and letters, be about 32 characters long
  - Verify that it has access to the following APIs:
    - Current Weather Data
    - 5 Day / 3 Hour Forecast
    - Air Pollution API
    - Geocoding API
  - Keep this key secret as it has usage limits
  - If you encounter API errors, verify this key is set correctly
- `NODE_VERSION`: 18.20.8 (or your preferred Node version)

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

## Post-Deployment Verification

1. Check that your site loads correctly
2. Verify that API requests are working:
   - Visit `/api-test` to check your API key status
   - Try searching for a city to test the geocoding API
   - Verify weather data loads for locations
3. If you encounter API issues:
   - Go to `/diagnostics` to access all testing tools
   - Check the environment variables in your Cloudflare Pages settings
   - Review the API troubleshooting guide at `/api-troubleshooting.html`
4. Test all functionality including language switching and theme toggle
5. Ensure responsive design works on different devices

## Troubleshooting

- **Build failures**: Check build logs for errors
  - If you see a "terser not found" error, use the `npm run build:cloudflare` command which automatically installs terser before building
- **API connectivity issues**: 
  - Verify your `OWM_API_KEY` is correctly set in the environment variables
  - Check the `/api-test` endpoint to validate your API key status
  - Use the `/diagnostics` page to access comprehensive testing tools
  - For detailed API error information, see the `/api-troubleshooting.html` guide
- **404 errors**: Check your `_redirects` file configuration
- **Performance issues**: Use Cloudflare's Analytics to identify bottlenecks
- **Wrangler.toml issues**: If you're using a wrangler.toml file, ensure it has the `pages_build_output_dir` property correctly set

### API Testing Tools

After deployment, these diagnostic endpoints are available:

1. `/diagnostics` - Main dashboard with links to all testing tools
2. `/api-test` - Simple API key validation
3. `/api-test-detailed` - Comprehensive tests of all API endpoints
4. `/direct-test` - Tests your API key directly against OpenWeatherMap
5. `/url-builder` - Tool to build and test different API URLs

For additional help, refer to [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).

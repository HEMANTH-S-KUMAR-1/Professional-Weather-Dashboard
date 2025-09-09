# API Diagnostic Tools

This document describes the API diagnostic tools included with the Professional Weather Dashboard project to help troubleshoot API connectivity issues.

## Available Diagnostic Tools

### 1. `/diagnostics`
Main diagnostic dashboard with links to all testing tools and environment information.

**Purpose:** Central hub for all diagnostic tools and high-level environment information.

**Features:**
- Environment variable detection
- API key status check
- Links to all other diagnostic tools
- Troubleshooting guidance

### 2. `/api-test`
Simple API key validation test that checks if your OpenWeatherMap API key is working.

**Purpose:** Quick verification of API key validity.

**Features:**
- Tests basic API connectivity
- Shows API key length and prefix (for security)
- Returns simple weather data if successful

### 3. `/api-test-detailed`
Comprehensive tests of all OpenWeatherMap API endpoints used by the dashboard.

**Purpose:** Detailed testing of all API endpoints to isolate specific connectivity issues.

**Features:**
- Tests all API endpoints in parallel
- Geocoding API test
- Current weather API test
- Forecast API test
- Air quality API test
- Detailed error reporting

### 4. `/direct-test`
Direct OpenWeatherMap API testing page that bypasses the Cloudflare Functions proxy.

**Purpose:** Determine if issues are with the API itself or with your proxy implementation.

**Features:**
- Makes direct requests to OpenWeatherMap API
- Uses client-side JavaScript
- Shows raw API responses
- Tests all endpoints directly

### 5. `/url-builder`
Tool to build and test different API URL combinations.

**Purpose:** Test specific API parameters and URL combinations to isolate URL encoding or parameter issues.

**Features:**
- URL parameter builder for all endpoints
- Direct and proxy URL generation
- URL encoding/decoding tools
- Response testing

### 6. `/public/api-test.html`
Client-side API testing tool accessible from the public directory.

**Purpose:** User-friendly interface for testing API connectivity from the client side.

**Features:**
- Tests key API functionality
- Works even if Cloudflare Functions are not responding
- Simple, user-friendly interface

### 7. `/public/api-troubleshooting.html`
Complete guide to common API errors and solutions.

**Purpose:** Documentation of common OpenWeatherMap API issues and how to resolve them.

**Features:**
- Error code explanations
- Step-by-step troubleshooting process
- API key configuration guide
- Links to official documentation

## Common Issues and Solutions

1. **API Key Not Found**
   - **Symptom:** `API key not configured` error
   - **Solution:** Ensure OWM_API_KEY is set in Cloudflare Pages environment variables

2. **Invalid API Key**
   - **Symptom:** 401 Unauthorized errors
   - **Solution:** Verify API key is correct, or generate a new one in OpenWeatherMap dashboard

3. **New API Key Activation**
   - **Symptom:** API key exists but returns 401 errors
   - **Solution:** New API keys may take up to 2 hours to activate

4. **Rate Limiting**
   - **Symptom:** 429 Too Many Requests errors
   - **Solution:** Reduce API call frequency or implement caching

5. **Invalid JSON Responses**
   - **Symptom:** "Invalid JSON from OpenWeatherMap" errors
   - **Solution:** Check network connectivity, API key validity, or if OpenWeatherMap is returning HTML error pages

## How to Use the Diagnostic Tools

1. **Deploy your application** to Cloudflare Pages
2. **Access the diagnostic dashboard** at `/diagnostics`
3. **Run the API Test** to verify basic API connectivity
4. **Check detailed tests** if basic tests fail
5. **Consult the troubleshooting guide** for specific error solutions
6. **Update your environment variables** as needed in Cloudflare Pages dashboard
7. **Redeploy** your application after making changes

## Maintenance

These diagnostic tools are designed to be maintenance-free and should continue to work as long as the OpenWeatherMap API structure remains compatible. If the OpenWeatherMap API changes significantly, you may need to update the diagnostic tools accordingly.

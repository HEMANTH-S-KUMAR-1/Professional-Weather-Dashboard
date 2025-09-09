🔧 **OpenWeatherMap API Key Setup Instructions**

## Issue: 429 Too Many Requests Error

Your current API key may have exceeded the rate limits. Here's how to fix this:

### Option 1: Wait for Rate Limit Reset
- Free tier: 60 calls/minute, 1000 calls/day
- Wait for the rate limit to reset (typically within an hour)

### Option 2: Get a New API Key (Recommended)

1. **Visit OpenWeatherMap:**
   https://openweathermap.org/api

2. **Sign up or log in to your account:**
   - Create a new account if you don't have one
   - Or log in to your existing account

3. **Navigate to API Keys:**
   - Go to your account dashboard
   - Click on "API keys" tab

4. **Generate a new key:**
   - Click "Generate" or "Create key"
   - Give it a descriptive name like "Professional Weather Dashboard"
   - Wait 10-15 minutes for activation (new keys take time to activate)

5. **Update your .env file:**
   ```
   OWM_API_KEY=your_new_api_key_here
   ```

6. **Restart the development server:**
   ```
   npm run dev
   ```

### Current Rate Limits Applied:
- ✅ Per-user limit: 30 requests/minute
- ✅ Global server limit: 100 requests/minute
- ✅ Request debouncing: 300ms delay
- ✅ Request caching: 5-minute cache duration
- ✅ Duplicate request prevention

### Troubleshooting:
- New API keys take 10 minutes to 2 hours to activate
- Free tier has daily limits that reset at midnight UTC
- If you're still getting 401 errors, the key might not be activated yet

**Your current API key:** fc145dd4b6ef156ad8cc792320c3689f
**Status:** May have exceeded rate limits

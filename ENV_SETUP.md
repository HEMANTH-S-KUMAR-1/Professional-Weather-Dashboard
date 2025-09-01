# Professional Weather Dashboard - Environment Setup

## For Local Development

1. Copy this file to create your own `.env.local`:
   ```bash
   cp .env .env.local
   ```

2. Edit `.env.local` and add your actual API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

## For Cloudflare Pages Deployment

Since this is a client-side application, environment variables from `.env` files won't work in the browser. Instead:

1. **Before deploying**: Temporarily replace `YOUR_API_KEY_HERE` in `weather.js` with your actual API key
2. **Deploy to Cloudflare Pages**
3. **After deployment**: Revert the API key back to placeholder in your local repository

## Security Note

- Never commit real API keys to version control
- The `.env` file is included in `.gitignore` to prevent accidental commits
- For production deployments with sensitive data, consider using Cloudflare Workers for server-side API calls

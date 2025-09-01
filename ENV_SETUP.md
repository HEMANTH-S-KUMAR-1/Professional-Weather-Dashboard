# Professional Weather Dashboard - Environment Setup

## For Local Development

### Method 1: Direct Edit (Quick Testing)
1. **Temporarily edit weather.js** for local testing:
   - Open `weather.js`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key
   - **Important:** Don't commit this change to Git

### Method 2: Environment Variable (Recommended)
1. Create `.env.local` file:
   ```bash
   cp .env .env.local
   ```

2. Edit `.env.local` and add your actual API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

3. Use a local development server that supports `.env` files

## For Cloudflare Pages Deployment

**✅ Current Setup (Recommended):**
The project now uses Cloudflare Pages environment variables with a Node.js build script:

1. **Set environment variable** in Cloudflare Pages dashboard:
   - Variable name: `OPENWEATHER_API_KEY`
   - Value: Your actual API key

2. **Build process** automatically handles API key injection:
   - Build command: `node build.js`
   - Output directory: `dist`
   - API key is replaced during build time

## Security Best Practices

- ✅ Never commit real API keys to version control
- ✅ Use environment variables for production deployments
- ✅ The `.env` file is included in `.gitignore`
- ✅ Build script creates secure deployment files
- ✅ Source files always contain placeholder values

## Getting Your API Key

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate your API key
4. Use it in your chosen setup method above

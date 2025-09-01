
# Professional Weather Dashboard

🌤️ **Live Demo:** Your site will be available at your Cloudflare Pages URL after deployment.

## Deploying to Cloudflare Pages (Secure Method)

This project uses environment variables to keep your API key secure:

### Step 1: Deploy to Cloudflare Pages
1. **Fork or clone this repository.**
2. **Go to [Cloudflare Pages](https://pages.cloudflare.com/) and create a new project.**
3. **Connect your GitHub repository.**
4. **Set build settings:**
   - Framework preset: None
   - Build command: `chmod +x build.sh && ./build.sh`
   - Output directory: `./`

### Step 2: Add Environment Variables (SECURE)
1. **In your Cloudflare Pages project settings:**
   - Go to "Settings" → "Environment Variables"
   - Click "Add variable"
   - Name: `OPENWEATHER_API_KEY`
   - Value: Your actual API key from https://openweathermap.org/api
   - Click "Save"

2. **Redeploy your project** to apply the environment variable

### Step 3: Your API Key is Now Secure! 🔒
- ✅ API key is stored securely in Cloudflare
- ✅ Not visible in your code or GitHub repository
- ✅ Automatically injected during build process

## Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HEMANTH-S-KUMAR-1/Professional-Weather-Dashboard.git
   cd Professional-Weather-Dashboard
   ```

2. **Set up API key:**
   - Edit `weather.js` and replace `YOUR_API_KEY_HERE` with your actual API key (for local testing only)
   - Or see `ENV_SETUP.md` for environment variable options

3. **Open the project:**
   - Open `weather.html` in your web browser

## Security Warning
- Never commit your real API key to a public repository
- The `.env` file and `.gitignore` are provided for local development safety
- For production with sensitive data, consider using Cloudflare Workers for server-side API calls

## Features
- Real-time weather data for any city worldwide
- Responsive design with modern UI
- Quick search for popular cities (auto-rotating every hour)
- Weather details: temperature, humidity, wind speed, pressure, visibility
- Local storage for recent searches
- Share functionality
- Demo mode when no API key is configured
- Accessibility features and keyboard shortcuts

## Usage
- Open the site and enter a city name to get weather data
- Use quick search buttons for popular cities
- If no API key is configured, demo data will be shown
- Keyboard shortcuts: Ctrl+K (focus search), Ctrl+R (refresh)

---

For questions or help, see the comments in `weather.js` or contact the maintainer.
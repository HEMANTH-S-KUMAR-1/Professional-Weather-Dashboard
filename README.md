
# Professional Weather Dashboard

## Deploying to Cloudflare Pages

This project is ready for static hosting on Cloudflare Pages. Follow these steps:

1. **Fork or clone this repository.**
2. **Go to [Cloudflare Pages](https://pages.cloudflare.com/) and create a new project.**
3. **Connect your GitHub repository.**
4. **Set build settings:**
   - Framework preset: None
   - Build command: (leave blank)
   - Output directory: `./`
5. **API Key Setup:**
   - **For deployment**: Edit `weather.js` and replace `YOUR_API_KEY_HERE` with your actual OpenWeatherMap API key
   - **Important**: Do not commit your real API key to the repository
   - Get your free API key at: https://openweathermap.org/api

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
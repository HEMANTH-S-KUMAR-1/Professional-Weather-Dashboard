
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
   - The file `weather.js` uses a placeholder for the OpenWeatherMap API key.
   - After deployment, edit the file in Cloudflare Pages or locally and replace `YOUR_API_KEY_HERE` with your actual API key.
   - **Do not commit your API key to the repository.**

## Security Warning
- Never upload your real API key to a public repository.
- For advanced security, use Cloudflare Workers to proxy API requests and keep your key secret.

## Usage
- Open the deployed site and enter a city name to get weather data.
- If no API key is set, demo data will be shown.

---

For questions or help, see the comments in `weather.js` or contact the maintainer.
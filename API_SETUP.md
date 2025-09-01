# API Key Setup Instructions

## For Local Development

1. **Create a `.env` file** in the project root (this file is already set up for you):
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

2. **Run the development server with API key**:
   ```bash
   npm run dev:env
   ```
   This command will:
   - Build the project with your API key
   - Serve the built version locally
   - Show real weather data instead of demo data

## For Production Deployment (Cloudflare Pages)

1. **Set Environment Variable** in Cloudflare Pages:
   - Go to your Cloudflare Pages dashboard
   - Navigate to Settings > Environment variables
   - Add: `OPENWEATHER_API_KEY` = `your_actual_api_key`

2. **Deploy**: The build process will automatically inject the API key during deployment.

## Security Notes

- ✅ The `.env` file is ignored by Git (already in `.gitignore`)
- ✅ Your API key will NOT be committed to GitHub
- ✅ The source `weather.js` keeps the placeholder `YOUR_API_KEY_HERE`
- ✅ Only the built files in `dist/` contain the real API key
- ✅ The `dist/` folder is also ignored by Git

## Available Commands

- `npm run build` - Build with API key from environment
- `npm run dev` - Serve source files on port 3000 (shows demo data)
- `npm run dev:env` - Build and serve with real API key on port 3003
- `npm run serve:dist` - Serve built files with API key on port 3003

## Quick Start

1. **With Real Weather Data** (recommended):
   ```bash
   npm run dev:env
   ```
   Opens http://127.0.0.1:3003 with your API key

2. **Demo Mode Only**:
   ```bash
   npm run dev
   ```
   Opens http://127.0.0.1:3000 with demo data

# 🌤️ Professional Weather Dashboard

A futuristic, animated, multilingual weather dashboard powered by OpenWeatherMap APIs. Features glassmorphism design, dark/light themes, real-time weather data with **optimized performance**, **enhanced security**, and **comprehensive rate limiting**.

![Weather Dashboard Preview](public/preview.jpg)

## ✨ Features

### 🗺️ **Live Location & Voice Search** (ENHANCED!)
- **Auto-Location Detection**: Automatically detects user's location on page load
- **Voice Search**: Multi-language voice recognition (English, Hindi, Kannada)
- **Location Fallback**: Uses Tumakuru, India as default when location access is denied
- **Smart Integration**: Voice results automatically update weather data
- **Rate Limited**: Intelligent request debouncing prevents API overuse

### 🌍 **Multilingual Support**
- **English** (default)
- **Hindi** (हिन्दी)  
- **Kannada** (ಕನ್ನಡ)
- Dynamic language switching with UI translations
- **Performance Optimized**: Language changes don't trigger excessive API calls

### 🌡️ **Weather Data**
- **Current Weather**: Temperature, humidity, wind speed, pressure, visibility
- **5-Day Forecast**: Daily weather predictions with icons
- **Air Quality**: AQI index with pollutant breakdowns (PM2.5, PM10, CO, NO₂, O₃, SO₂)
- **City Search**: Autocomplete search with geocoding + voice input
- **Request Caching**: 5-minute cache prevents duplicate API calls

### 🎨 **Modern Design**
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Theme Toggle**: Dark mode with neon gradients, light mode with pastels
- **Animations**: Smooth transitions, hover effects, loading states
- **Responsive**: Mobile-first design with breakpoints for all devices
- **React.memo Optimized**: Components prevent unnecessary re-renders

### 🔒 **Security & Performance** (NEWLY ENHANCED!)
- **API Proxy**: Backend secures OpenWeatherMap API keys
- **Enhanced Rate Limiting**: 30 requests/minute per user, 100 global requests/minute
- **Request Debouncing**: 300ms delay prevents rapid-fire API calls
- **Duplicate Prevention**: Smart caching prevents identical requests
- **Environment Variables**: Secure configuration management
- **CORS Protection**: Enhanced cross-origin resource sharing policies
- **Image Optimization**: Lazy loading for faster page loads
- **Performance Monitoring**: Real-time tracking of loading metrics
- **Code Splitting**: Optimized bundle sizes (React, Framer Motion, Icons separated)
- **Production Optimizations**: Console logs removed, terser minification
- **Service Worker**: PWA capabilities with intelligent caching

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- OpenWeatherMap API key ([Get one free](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/professional-weather-dashboard.git
   cd professional-weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install both frontend and backend dependencies
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env and add your OpenWeatherMap API key
   # OWM_API_KEY=your_api_key_here
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Frontend will be available at: http://localhost:5173
   # Backend API will be available at: http://localhost:3001 (auto-configured)
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## ⚡ Performance Optimizations (2025 UPDATE)

This project includes cutting-edge performance optimizations implemented in September 2025:

### 🚀 **Build Optimizations**
- **Terser Minification**: Console logs removed in production builds
- **Code Splitting**: Separate chunks for React (139KB), Framer Motion (115KB), Icons (6KB)
- **Bundle Analysis**: Optimized chunk sizes with 1MB warning limit
- **Tree Shaking**: Unused code elimination for smaller bundles

### 🧠 **React Performance**
- **React.memo**: WeatherCard, ForecastCard, and AirQualityCard prevent unnecessary re-renders
- **useCallback**: Weather data fetching is properly memoized
- **Smart Dependencies**: useEffect dependencies optimized to prevent infinite loops

### 🔄 **API Request Optimizations**
- **Request Debouncing**: 300ms delay prevents rapid API calls
- **5-minute Caching**: Prevents duplicate requests for same location/language
- **Duplicate Prevention**: Smart request tracking with unique keys
- **Rate Limiting**: Per-user (30/min) and global (100/min) limits

### 💾 **PWA Features**
- **Service Worker**: Professional-weather-dashboard-v2 with enhanced caching
- **Manifest**: Full PWA support with offline capabilities
- **Cache Strategy**: Network-first for API calls, cache-first for static assets

## 🎯 How to Use

### Live Location Detection
- **Automatic**: Weather data loads automatically for your current location on first visit
- **Permission Required**: Grant location access when prompted for best experience
- **Fallback**: If denied, defaults to Tumakuru, India weather data

### Voice Search
- **Activate**: Click the microphone button next to the search bar
- **Speak**: Say the city name in English, Hindi, or Kannada
- **Results**: Weather automatically updates with detected city
- **Supported Languages**: 
  - English: "New York", "London", "Tokyo"
  - Hindi: "नई दिल्ली", "मुंबई", "बैंगलोर"
  - Kannada: "ಬೆಂಗಳೂರು", "ಮೈಸೂರು", "ಮಂಗಳೂರು"

### Text Search
- **Type**: Enter city name in the search bar
- **Select**: Choose from autocomplete suggestions
- **Global**: Search cities worldwide with country context

## 📁 Project Structure

```
professional-weather-dashboard/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
├── public/                 # Static assets
│   ├── favicon.svg         # Website favicon
│   ├── robots.txt          # Search engine instructions
│   ├── _redirects          # Netlify routing configuration
│   └── preview.jpg         # Social media preview image
├── src/                   # React frontend source
│   ├── components/        # React components
│   │   ├── WeatherCard.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── AirQualityCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LocationDetector.tsx  # NEW: Auto-location detection
│   │   └── VoiceSearch.tsx       # NEW: Voice search component
│   ├── hooks/            # Custom React hooks
│   │   ├── useWeatherData.ts
│   │   ├── useGeolocation.ts     # NEW: Geolocation hook
│   │   └── useSpeechRecognition.ts # NEW: Voice recognition hook
│   ├── utils/            # Utility functions
│   │   ├── translations.ts
│   │   ├── lazyLoad.ts
│   │   └── performanceMonitor.ts
│   ├── types/            # TypeScript definitions
│   │   └── weather.ts
│   └── App.tsx           # Main application component
├── .github/workflows/    # CI/CD GitHub Actions
├── .env.example          # Environment variables template
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🌐 API Endpoints

### Backend API Routes
```
GET /api/weather/current        # Current weather data
GET /api/weather/forecast       # 5-day weather forecast  
GET /api/weather/air-pollution  # Air quality data
GET /api/geo/direct            # City search/geocoding
GET /api/health               # API health check
```

### Request Parameters
- `lat`, `lon`: Coordinates (required)
- `lang`: Language code (optional, defaults to 'en')
- `q`: City name for search (required for geocoding)

## 🎨 Customization

### Adding New Languages
1. Update `src/utils/translations.ts`
2. Add translations for all required keys
3. Update the language selector component

### Modifying Themes
1. Edit `src/App.tsx` gradient classes
2. Customize colors in `tailwind.config.js`
3. Update component theme logic

### API Configuration
- Modify endpoints in `backend/server.js`
- Update API base URL in `src/hooks/useWeatherData.ts`

## 🚀 Deployment

### Cloudflare Pages Deployment
```bash
# Build for Cloudflare Pages with Functions
npm run build:cloudflare
```

1. **Setup Cloudflare Pages**: Connect your GitHub repository
2. **Configure Build Settings**:
   - Build command: `npm run build:cloudflare`
   - Build output directory: `dist`
3. **Set Environment Variables**:
   - `OWM_API_KEY`: Your OpenWeatherMap API key
   - `NODE_VERSION`: 18.0.0 (or higher)
4. **Deploy**: Trigger a deploy from the Cloudflare dashboard

### Traditional Frontend/Backend Deployment
```bash
npm run build
# Deploy the 'dist' folder
```

1. Deploy the `backend` folder to a Node.js host
2. Set environment variables in your platform
3. Update frontend API URLs to production backend

### Environment Variables for Production
```env
OWM_API_KEY=your_openweathermap_api_key
PORT=3000
NODE_ENV=production
```

## 🔧 Troubleshooting Tools

When deployed to Cloudflare Pages, this project includes several diagnostic tools to help identify and fix API problems:

### API Diagnostic Endpoints

- **`/diagnostics`**: Main diagnostic dashboard with links to all testing tools
- **`/api-test`**: Simple API key validation test
- **`/api-test-detailed`**: Comprehensive tests of all API endpoints
- **`/direct-test`**: Direct OpenWeatherMap API testing (bypasses proxy)
- **`/url-builder`**: Tool to build and test different API URL combinations
- **`/public/api-troubleshooting.html`**: Complete guide to common API errors and solutions

### Common API Issues

1. **Invalid API Key**: Check that your OWM_API_KEY is correctly set in Cloudflare environment variables
2. **Rate Limiting**: Free tier is limited to 60 calls/minute and 1,000,000 calls/month
3. **New API Key Activation**: New API keys may take up to 2 hours to activate
4. **CORS Issues**: If testing locally, ensure your API proxy is handling CORS headers correctly

See the API Troubleshooting Guide at `/public/api-troubleshooting.html` for detailed solutions to common problems.

## 🔧 Development & Performance

### Available Scripts
```bash
npm run dev          # Start both frontend (port 5173) and backend (port 3001)
npm run dev:frontend # Start only frontend (Vite dev server)
npm run dev:backend  # Start only backend (Express server)
npm run build        # Build frontend for production (optimized with terser)
npm run build:cloudflare # Build for Cloudflare Pages deployment
npm run preview      # Preview production build locally
npm run lint         # Run ESLint to check code quality (zero errors/warnings)
```

### Performance Optimizations (LATEST 2025 UPDATES)
This project includes several cutting-edge performance optimizations:

1. **React Component Memoization**: `React.memo` implemented on WeatherCard, ForecastCard, and AirQualityCard
2. **API Request Optimization**: 
   - 300ms debouncing prevents rapid API calls
   - 5-minute request caching reduces API usage
   - Duplicate request prevention with unique key tracking
3. **Enhanced Rate Limiting**: 
   - Per-user: 30 requests/minute
   - Global server: 100 requests/minute
   - Retry-after headers for better client handling
4. **Build Optimizations**:
   - Terser minification with console log removal
   - Manual chunk splitting: React (139KB), Framer Motion (115KB), Icons (6KB)
   - Tree shaking and dead code elimination
5. **PWA Enhancement**: 
   - Updated service worker (professional-weather-dashboard-v2)
   - Intelligent caching strategy
   - Network-first for APIs, cache-first for assets
6. **Bundle Analysis**: Optimized loading with 1MB chunk size warnings

1. **Lazy Loading Images**: Using the `lazyLoad` utility to defer loading of offscreen images
2. **Performance Monitoring**: Real-time tracking of page load metrics and long tasks
3. **Route-Based Code Splitting**: Only loading components needed for current route
4. **Minification and Compression**: Optimized bundle sizes with Terser
5. **Bundle Optimization**: Manual chunk splitting for React and Framer Motion
6. **Proper Error Handling**: Custom error page with helpful diagnostics
7. **Cached API Responses**: Backend caching for frequent weather queries

To implement lazy loading in your components:
```jsx
import { lazyLoad } from '../utils/lazyLoad';
import { useEffect } from 'react';

const YourComponent = () => {
  useEffect(() => {
    // Initialize lazy loading
    lazyLoad.init();
  }, []);

  return (
    <img 
      src="placeholder.jpg" 
      data-src="actual-image.jpg" 
      alt="Description" 
    />
  );
};
```

To measure performance:
```jsx
import { performanceMonitor } from '../utils/performanceMonitor';

// Start timing
performanceMonitor.mark('operation-name');

// Do some work...

// End timing and log result
const duration = performanceMonitor.measure('operation-name');
```

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 84+
- Safari 14+
- Mobile browsers with backdrop-filter support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data APIs
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/professional-weather-dashboard/issues) page
2. Create a new issue with detailed information
3. Check the diagnostic tools at `/diagnostics` for API issues
4. Join our community discussions

---

**Built with ❤️ and modern web technologies**
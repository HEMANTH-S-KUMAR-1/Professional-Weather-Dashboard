# 🌤️ Professional Weather Dashboard

A futuristic, animated, multilingual weather dashboard powered by OpenWeatherMap APIs. Features glassmorphism design, dark/light themes, and real-time weather data including current conditions, 5-day forecasts, and air quality metrics.

![Weather Dashboard Preview](https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop)

## ✨ Features

### 🌍 **Multilingual Support**
- **English** (default)
- **Hindi** (हिन्दी)  
- **Kannada** (ಕನ್ನಡ)
- Dynamic language switching with UI translations

### 🌡️ **Weather Data**
- **Current Weather**: Temperature, humidity, wind speed, pressure, visibility
- **5-Day Forecast**: Daily weather predictions with icons
- **Air Quality**: AQI index with pollutant breakdowns (PM2.5, PM10, CO, NO₂, O₃, SO₂)
- **City Search**: Autocomplete search with geocoding

### 🎨 **Modern Design**
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Theme Toggle**: Dark mode with neon gradients, light mode with pastels
- **Animations**: Smooth transitions, hover effects, loading states
- **Responsive**: Mobile-first design with breakpoints for all devices

### 🔒 **Security**
- **API Proxy**: Backend secures OpenWeatherMap API keys
- **Environment Variables**: Secure configuration management
- **CORS Protection**: Proper cross-origin resource sharing
- **Rate Limiting**: Basic protection against abuse

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
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
professional-weather-dashboard/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
├── public/                 # Static assets
│   ├── favicon.svg         # Website favicon
│   ├── robots.txt          # Search engine instructions
│   └── preview.jpg         # Social media preview image
├── src/                   # React frontend source
│   ├── components/        # React components
│   │   ├── WeatherCard.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── AirQualityCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── SearchBar.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useWeatherData.ts
│   ├── utils/            # Utility functions
│   │   └── translations.ts
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

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render)
1. Deploy the `backend` folder
2. Set environment variables in your platform
3. Update frontend API URLs to production backend

### Environment Variables for Production
```env
OWM_API_KEY=your_openweathermap_api_key
PORT=3000
NODE_ENV=production
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run dev:frontend # Start only frontend (Vite dev server)
npm run dev:backend  # Start only backend (Express server)
npm run build        # Build frontend for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint to check code quality
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized with lazy loading and code splitting

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
3. Join our community discussions

---

**Built with ❤️ and modern web technologies**
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSelector } from './components/LanguageSelector';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { AirQualityCard } from './components/AirQualityCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { NotFoundPage } from './components/NotFoundPage';
import { LocationDetector } from './components/LocationDetector';
import { useWeatherData } from './hooks/useWeatherData';
import { translations, Language } from './utils/translations';
import { lazyLoad } from './utils/lazyLoad';
import { performanceMonitor } from './utils/performanceMonitor';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    // Get the path or default to home
    const path = window.location.pathname;
    return path === '/' ? 'home' : '404';
  });

  const {
    currentWeather,
    forecast,
    airPollution,
    loading,
    error,
    fetchWeatherData
  } = useWeatherData();

  const t = translations[currentLanguage];

  // Initialize performance monitoring
  useEffect(() => {
    // Start performance monitoring
    performanceMonitor.recordPageLoadMetrics();
    
    // Detect long tasks
    const longTaskObserver = performanceMonitor.detectLongTasks();
    
    // Initialize lazy loading
    lazyLoad.init();
    
    return () => {
      // Clean up observers
      if (longTaskObserver) {
        longTaskObserver.disconnect();
      }
    };
  }, []);

  // Theme toggle
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Handle language changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Handle browser navigation
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      setCurrentRoute(path === '/' ? 'home' : '404');
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleLocationSelect = (lat: number, lon: number) => {
    fetchWeatherData(lat, lon, currentLanguage);
  };

  const handleRetry = () => {
    if (currentWeather) {
      fetchWeatherData(
        currentWeather.coord.lat, 
        currentWeather.coord.lon, 
        currentLanguage
      );
    } else {
      fetchWeatherData(28.6139, 77.2090, currentLanguage); // Default to Delhi
    }
  };

  const goToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('home');
  };

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }
    `}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          backdrop-blur-md border-b sticky top-0 z-40
          ${isDark 
            ? 'bg-gray-900/20 border-gray-700/30' 
            : 'bg-white/20 border-white/30'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <motion.h1
              className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              onClick={goToHome}
            >
              {t.appTitle}
            </motion.h1>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {currentRoute === 'home' && (
                <SearchBar
                  onLocationSelect={handleLocationSelect}
                  placeholder={t.searchPlaceholder}
                  isDark={isDark}
                  currentLanguage={currentLanguage}
                />
              )}
              
              <div className="flex items-center space-x-4">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={setCurrentLanguage}
                  isDark={isDark}
                />
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Detector - Auto-detects user's location on page load */}
        <LocationDetector
          onLocationDetected={handleLocationSelect}
          currentLanguage={currentLanguage}
        />

        <AnimatePresence mode="wait">
          {currentRoute === 'home' ? (
            loading ? (
              <LoadingSpinner isDark={isDark} message={t.loading} />
            ) : error ? (
              <ErrorMessage 
                message={error} 
                onRetry={handleRetry} 
                isDark={isDark} 
              />
            ) : currentWeather && forecast && airPollution ? (
              <motion.div
                key="weather-data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Current Weather */}
                <WeatherCard
                  weatherData={currentWeather}
                  translations={t}
                  isDark={isDark}
                />

                {/* Forecast and Air Quality Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <ForecastCard
                      forecastData={forecast}
                      translations={t}
                      isDark={isDark}
                    />
                  </div>
                  <div>
                    <AirQualityCard
                      airPollutionData={airPollution}
                      translations={t}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null
          ) : (
            <NotFoundPage isDark={isDark} onBackToHome={goToHome} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`
          mt-16 py-8 backdrop-blur-md border-t
          ${isDark 
            ? 'bg-gray-900/20 border-gray-700/30' 
            : 'bg-white/20 border-white/30'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by{' '}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium transition-colors ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              OpenWeatherMap
            </a>
            {' '}• Built with ❤️ for the community
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
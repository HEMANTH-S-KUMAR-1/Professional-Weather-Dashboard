import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Sunrise, 
  Sunset,
  Gauge
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { Translations } from '../utils/translations';

interface WeatherCardProps {
  weatherData: WeatherData;
  translations: Translations;
  isDark: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, translations, isDark }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        backdrop-blur-md rounded-2xl border p-8 transition-all duration-300
        ${isDark 
          ? 'bg-gray-800/40 border-gray-700/50' 
          : 'bg-white/40 border-white/30'
        }
      `}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {translations.currentWeather}
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
            {weatherData.name}, {weatherData.sys.country}
          </p>
        </div>
        <motion.img
          src={iconUrl}
          alt={weatherData.weather[0].description}
          className="w-20 h-20"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temperature Section */}
        <div className="space-y-6">
          <motion.div 
            className="text-center lg:text-left"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`text-6xl font-light ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {Math.round(weatherData.main.temp)}°
            </div>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              {translations.feelsLike} {Math.round(weatherData.main.feels_like)}°
            </p>
            <p className={`text-xl capitalize ${isDark ? 'text-gray-200' : 'text-gray-700'} mt-1`}>
              {weatherData.weather[0].description}
            </p>
          </motion.div>

          <div className="flex justify-center lg:justify-start space-x-6">
            <div className={`flex items-center space-x-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              <Sunrise className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-70">{translations.sunrise}</p>
                <p className="font-medium">{formatTime(weatherData.sys.sunrise)}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
              <Sunset className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-70">{translations.sunset}</p>
                <p className="font-medium">{formatTime(weatherData.sys.sunset)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className={`
              p-4 rounded-xl backdrop-blur-sm border transition-colors duration-300
              ${isDark 
                ? 'bg-blue-500/10 border-blue-500/20' 
                : 'bg-blue-500/10 border-blue-500/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2 text-blue-500 mb-2">
              <Droplets className="w-5 h-5" />
              <span className="text-sm font-medium">{translations.humidity}</span>
            </div>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {weatherData.main.humidity}%
            </p>
          </motion.div>

          <motion.div
            className={`
              p-4 rounded-xl backdrop-blur-sm border transition-colors duration-300
              ${isDark 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-green-500/10 border-green-500/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2 text-green-500 mb-2">
              <Wind className="w-5 h-5" />
              <span className="text-sm font-medium">{translations.windSpeed}</span>
            </div>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {weatherData.wind.speed} m/s
            </p>
          </motion.div>

          <motion.div
            className={`
              p-4 rounded-xl backdrop-blur-sm border transition-colors duration-300
              ${isDark 
                ? 'bg-purple-500/10 border-purple-500/20' 
                : 'bg-purple-500/10 border-purple-500/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2 text-purple-500 mb-2">
              <Gauge className="w-5 h-5" />
              <span className="text-sm font-medium">{translations.pressure}</span>
            </div>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {weatherData.main.pressure} hPa
            </p>
          </motion.div>

          <motion.div
            className={`
              p-4 rounded-xl backdrop-blur-sm border transition-colors duration-300
              ${isDark 
                ? 'bg-yellow-500/10 border-yellow-500/20' 
                : 'bg-yellow-500/10 border-yellow-500/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2 text-yellow-500 mb-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">{translations.visibility}</span>
            </div>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {(weatherData.visibility / 1000).toFixed(1)} km
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ForecastData } from '../types/weather';
import { Translations } from '../utils/translations';

interface ForecastCardProps {
  forecastData: ForecastData;
  translations: Translations;
  isDark: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = memo(({ forecastData, translations, isDark }) => {
  // Group forecast by days (take one entry per day around noon)
  const dailyForecasts = forecastData.list.filter((item, _index) => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours();
    return hour >= 11 && hour <= 13; // Around noon
  }).slice(0, 5);

  const formatDate = (timestamp: number, _index: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return translations.today;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return translations.tomorrow;
    } else {
      return translations.dayNames[date.getDay()];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`
        backdrop-blur-md rounded-2xl border p-6 transition-all duration-300
        ${isDark 
          ? 'bg-gray-800/40 border-gray-700/50' 
          : 'bg-white/40 border-white/30'
        }
      `}
    >
      <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {translations.forecast}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyForecasts.map((item, index) => (
          <motion.div
            key={item.dt}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`
              p-4 rounded-xl backdrop-blur-sm border text-center transition-all duration-300
              ${isDark 
                ? 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-600/30' 
                : 'bg-white/30 border-white/40 hover:bg-white/50'
              }
            `}
          >
            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {formatDate(item.dt, index)}
            </p>
            
            <motion.img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              className="w-12 h-12 mx-auto mb-2"
              whileHover={{ rotate: 5 }}
            />
            
            <div className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {Math.round(item.main.temp)}°
            </div>
            
            <p className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {item.weather[0].description}
            </p>
            
            <div className="flex justify-between text-xs">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                H: {Math.round(item.main.temp_max)}°
              </span>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                L: {Math.round(item.main.temp_min)}°
              </span>
            </div>
            
            {item.pop > 0.1 && (
              <div className="mt-2 flex items-center justify-center text-xs text-blue-500">
                <span>{Math.round(item.pop * 100)}% ☔</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
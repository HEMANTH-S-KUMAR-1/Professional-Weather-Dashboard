import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { AirPollutionData } from '../types/weather';
import { Translations } from '../utils/translations';

interface AirQualityCardProps {
  airPollutionData: AirPollutionData;
  translations: Translations;
  isDark: boolean;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = memo(({ 
  airPollutionData, 
  translations, 
  isDark 
}) => {
  const aqi = airPollutionData.list[0].main.aqi;
  const components = airPollutionData.list[0].components;

  const getAQIColor = (aqi: number) => {
    const colors = {
      1: isDark ? 'text-green-400' : 'text-green-600', // Good
      2: isDark ? 'text-yellow-400' : 'text-yellow-600', // Fair  
      3: isDark ? 'text-orange-400' : 'text-orange-600', // Moderate
      4: isDark ? 'text-red-400' : 'text-red-600', // Poor
      5: isDark ? 'text-purple-400' : 'text-purple-600', // Very Poor
    };
    return colors[aqi as keyof typeof colors] || colors[3];
  };

  const getAQIGradient = (aqi: number) => {
    const gradients = {
      1: 'from-green-400 to-green-600', // Good
      2: 'from-yellow-400 to-yellow-600', // Fair
      3: 'from-orange-400 to-orange-600', // Moderate
      4: 'from-red-400 to-red-600', // Poor
      5: 'from-purple-400 to-purple-600', // Very Poor
    };
    return gradients[aqi as keyof typeof gradients] || gradients[3];
  };

  const pollutants = [
    { key: 'pm2_5', label: translations.pm25, value: components.pm2_5, unit: 'μg/m³' },
    { key: 'pm10', label: translations.pm10, value: components.pm10, unit: 'μg/m³' },
    { key: 'co', label: translations.co, value: components.co, unit: 'μg/m³' },
    { key: 'no2', label: translations.no2, value: components.no2, unit: 'μg/m³' },
    { key: 'o3', label: translations.o3, value: components.o3, unit: 'μg/m³' },
    { key: 'so2', label: translations.so2, value: components.so2, unit: 'μg/m³' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`
        backdrop-blur-md rounded-2xl border p-6 transition-all duration-300
        ${isDark 
          ? 'bg-gray-800/40 border-gray-700/50' 
          : 'bg-white/40 border-white/30'
        }
      `}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Wind className={`w-6 h-6 ${getAQIColor(aqi)}`} />
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {translations.airQuality}
        </h3>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {translations.airQualityIndex}
          </span>
          <span className={`text-lg font-bold ${getAQIColor(aqi)}`}>
            {translations.aqiLevels[aqi - 1]} ({aqi}/5)
          </span>
        </div>
        
        <div className="relative">
          <div className={`h-3 rounded-full bg-gradient-to-r ${isDark ? 'from-gray-700 to-gray-600' : 'from-gray-200 to-gray-300'}`}>
            <motion.div
              className={`h-3 rounded-full bg-gradient-to-r ${getAQIGradient(aqi)}`}
              initial={{ width: 0 }}
              animate={{ width: `${(aqi / 5) * 100}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2">
            {translations.aqiLevels.map((level, index) => (
              <span 
                key={index} 
                className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {level}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pollutants.map((pollutant, index) => (
          <motion.div
            key={pollutant.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className={`
              p-3 rounded-lg backdrop-blur-sm border text-center transition-colors duration-300
              ${isDark 
                ? 'bg-gray-700/30 border-gray-600/30' 
                : 'bg-white/30 border-white/40'
              }
            `}
          >
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {pollutant.label}
            </p>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {pollutant.value.toFixed(1)}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {pollutant.unit}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
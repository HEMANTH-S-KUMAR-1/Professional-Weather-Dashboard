import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeocodingResult } from '../types/weather';
import { useWeatherData } from '../hooks/useWeatherData';

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number) => void;
  placeholder: string;
  isDark: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, placeholder, isDark }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { searchCities } = useWeatherData();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const cities = await searchCities(searchQuery);
      setResults(cities);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location: GeocodingResult) => {
    setQuery(`${location.name}, ${location.country}`);
    setShowResults(false);
    onLocationSelect(location.lat, location.lon);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className={`
        relative flex items-center backdrop-blur-md rounded-xl border transition-all duration-300
        ${isDark 
          ? 'bg-gray-800/40 border-gray-700/50' 
          : 'bg-white/40 border-white/30'
        }
      `}>
        <Search className={`
          absolute left-4 w-5 h-5 
          ${isDark ? 'text-gray-400' : 'text-gray-500'}
        `} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none rounded-xl
            ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}
          `}
        />
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute top-full mt-2 w-full rounded-xl backdrop-blur-md border overflow-hidden z-50
              ${isDark 
                ? 'bg-gray-800/90 border-gray-700/50' 
                : 'bg-white/90 border-white/30'
              }
            `}
          >
            {isSearching ? (
              <div className={`px-4 py-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((location) => (
                <motion.button
                  key={`${location.lat}-${location.lon}`}
                  onClick={() => handleLocationSelect(location)}
                  className={`
                    w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors duration-200
                    ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-white/50'}
                    ${isDark ? 'text-gray-200' : 'text-gray-700'}
                  `}
                  whileHover={{ x: 2 }}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm opacity-70">
                      {location.state ? `${location.state}, ` : ''}{location.country}
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className={`px-4 py-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                No locations found. Please check if the API key is set correctly.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isSearching && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};
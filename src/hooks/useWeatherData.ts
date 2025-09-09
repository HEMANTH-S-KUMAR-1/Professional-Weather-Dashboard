import { useState, useEffect } from 'react';
import { WeatherData, ForecastData, AirPollutionData, GeocodingResult } from '../types/weather';

// Use relative URL in development, which will be proxied through Vite
// In production, this would be replaced with the full backend URL
const API_BASE = '/api';

interface UseWeatherDataReturn {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  airPollution: AirPollutionData | null;
  loading: boolean;
  error: string | null;
  searchCities: (query: string) => Promise<GeocodingResult[]>;
  fetchWeatherData: (lat: number, lon: number, lang?: string) => Promise<void>;
}

export const useWeatherData = (): UseWeatherDataReturn => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat: number, lon: number, lang: string = 'en') => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherRes, forecastRes, pollutionRes] = await Promise.all([
        fetch(`${API_BASE}/weather/current?lat=${lat}&lon=${lon}&lang=${lang}`),
        fetch(`${API_BASE}/weather/forecast?lat=${lat}&lon=${lon}&lang=${lang}`),
        fetch(`${API_BASE}/weather/air-pollution?lat=${lat}&lon=${lon}`)
      ]);

      if (!weatherRes.ok || !forecastRes.ok || !pollutionRes.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [weather, forecastData, pollution] = await Promise.all([
        weatherRes.json(),
        forecastRes.json(),
        pollutionRes.json()
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
      setAirPollution(pollution);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Weather data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query: string): Promise<GeocodingResult[]> => {
    if (!query.trim()) return [];
    
    try {
      const response = await fetch(`${API_BASE}/geo/direct?q=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) throw new Error('City search failed');
      
      return await response.json();
    } catch (err) {
      console.error('City search error:', err);
      return [];
    }
  };

  // Fetch default location (Delhi) on component mount
  useEffect(() => {
    fetchWeatherData(28.6139, 77.2090); // Delhi coordinates
  }, []);

  return {
    currentWeather,
    forecast,
    airPollution,
    loading,
    error,
    searchCities,
    fetchWeatherData,
  };
};
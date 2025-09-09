import { useState, useCallback, useRef } from 'react';
import { WeatherData, ForecastData, AirPollutionData, GeocodingResult } from '../types/weather';

// Use relative URL in development, which will be proxied through Vite
// In production, this would be replaced with the full backend URL
const API_BASE = '/api';

// Cache to prevent duplicate requests
interface CachedWeatherData {
  weather: WeatherData;
  forecast: ForecastData;
  pollution: AirPollutionData;
  timestamp: number;
}

const requestCache = new Map<string, CachedWeatherData>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  
  // Ref to track the last request to prevent duplicate calls
  const lastRequestRef = useRef<string>('');
  const debounceTimerRef = useRef<number>();

  const fetchWeatherData = useCallback(async (lat: number, lon: number, lang: string = 'en') => {
    // Create unique key for this request
    const requestKey = `weather-${lat.toFixed(4)}-${lon.toFixed(4)}-${lang}`;
    
    // Prevent duplicate requests
    if (lastRequestRef.current === requestKey) {
      return;
    }
    
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the request by 300ms
    debounceTimerRef.current = window.setTimeout(async () => {
      lastRequestRef.current = requestKey;
      
      // Check cache first
      const cached = requestCache.get(requestKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setCurrentWeather(cached.weather);
        setForecast(cached.forecast);
        setAirPollution(cached.pollution);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const [weatherRes, forecastRes, pollutionRes] = await Promise.all([
          fetch(`${API_BASE}/weather/current?lat=${lat}&lon=${lon}&lang=${lang}`),
          fetch(`${API_BASE}/weather/forecast?lat=${lat}&lon=${lon}&lang=${lang}`),
          fetch(`${API_BASE}/weather/air-pollution?lat=${lat}&lon=${lon}`)
        ]);

        // Check if any response is not OK
        if (!weatherRes.ok || !forecastRes.ok || !pollutionRes.ok) {
          const errorResponse = !weatherRes.ok ? weatherRes : !forecastRes.ok ? forecastRes : pollutionRes;
          const errorText = await errorResponse.text();
          
          // Try to parse as JSON, but handle if it's HTML
          try {
            const errorJson = JSON.parse(errorText);
            
            // Enhanced error messages for common issues
            if (errorJson.error === 'API key not configured') {
              throw new Error('API key is missing. Please set the OWM_API_KEY environment variable.');
            } else if (errorJson.error === 'Invalid API key format') {
              throw new Error('API key format is invalid. Please check your OpenWeatherMap API key.');
            } else if (errorResponse.status === 429) {
              throw new Error('API rate limit exceeded. Please try again later.');
            } else if (errorResponse.status === 401) {
              throw new Error('Unauthorized: API key is invalid or not activated yet. New API keys may take up to 2 hours to activate.');
            } else {
              throw new Error(errorJson.message || errorJson.error || `Failed to fetch weather data: ${errorResponse.status}`);
            }
          } catch (_parseError) {
            // If it's HTML or invalid JSON, provide a more helpful error
            if (errorText.includes('<!doctype') || errorText.includes('<html')) {
              throw new Error('API returned HTML instead of JSON. Check if the API key is set correctly.');
            } else {
              throw new Error(`Failed to fetch weather data: ${errorResponse.status} ${errorResponse.statusText}`);
            }
          }
        }

        // Parse JSON responses with error handling
        const parseJsonSafely = async (response: Response) => {
          const text = await response.text();
          try {
            return JSON.parse(text);
          } catch (_e) {
            console.error('Failed to parse JSON:', text.substring(0, 100) + '...');
            throw new Error('Invalid JSON response from API');
          }
        };

        const [weather, forecastData, pollution] = await Promise.all([
          parseJsonSafely(weatherRes),
          parseJsonSafely(forecastRes),
          parseJsonSafely(pollutionRes)
        ]);

        // Cache the successful response
        requestCache.set(requestKey, {
          weather,
          forecast: forecastData,
          pollution,
          timestamp: Date.now()
        });

        setCurrentWeather(weather);
        setForecast(forecastData);
        setAirPollution(pollution);
      } catch (err) {
        console.error('Weather data fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const searchCities = async (query: string): Promise<GeocodingResult[]> => {
    if (!query.trim()) return [];
    
    try {
      const response = await fetch(`${API_BASE}/geo/direct?q=${encodeURIComponent(query)}&limit=5`);
      
      if (!response.ok) {
        console.error('City search failed:', response.status, response.statusText);
        throw new Error('City search failed');
      }
      
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (_e) {
        console.error('Failed to parse geocoding JSON:', text.substring(0, 100) + '...');
        throw new Error('Invalid JSON response from geocoding API');
      }
    } catch (err) {
      console.error('City search error:', err);
      return [];
    }
  };

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
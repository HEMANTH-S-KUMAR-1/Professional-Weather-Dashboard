import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  // Memoize the options to prevent unnecessary re-renders
  const { enableHighAccuracy = false, timeout = 15000, maximumAge = 0 } = options;

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('❌ Geolocation not supported by browser');
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      return;
    }

    console.log('🌍 Starting geolocation request...');
    
    const defaultOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    const onSuccess = (position: GeolocationPosition) => {
      console.log('✅ Geolocation success:', {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
      
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'An unknown error occurred.';
      
      console.error('❌ Geolocation error:', {
        code: error.code,
        message: error.message
      });
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user.';
          console.warn('User denied geolocation permission');
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          console.warn('Geolocation position unavailable');
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          console.warn('Geolocation request timed out');
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, defaultOptions);

    // Set a backup timeout in case the browser doesn't call onError
    const backupTimeout = setTimeout(() => {
      console.warn('⏰ Geolocation backup timeout triggered');
      setState(prev => {
        if (prev.loading) {
          return {
            ...prev,
            error: 'Location request took too long.',
            loading: false,
          };
        }
        return prev;
      });
    }, timeout + 2000); // 2 seconds after the main timeout

    return () => {
      clearTimeout(backupTimeout);
    };
  }, [enableHighAccuracy, timeout, maximumAge]);

  return state;
};

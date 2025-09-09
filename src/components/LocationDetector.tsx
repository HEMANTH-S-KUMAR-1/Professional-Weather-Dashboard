import { useEffect, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { translations, Language } from '../utils/translations';

interface LocationDetectorProps {
  onLocationDetected: (lat: number, lon: number) => void;
  currentLanguage: Language;
  className?: string;
}

export const LocationDetector = ({ onLocationDetected, currentLanguage, className = '' }: LocationDetectorProps) => {
  const [hasTriedLocation, setHasTriedLocation] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const t = translations[currentLanguage];

  const { latitude, longitude, error, loading } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000, // Reduced timeout for faster fallback
    maximumAge: 300000, // 5 minutes
  });

  useEffect(() => {
    // Show status immediately when starting location detection
    setShowStatus(true);
  }, []);

  useEffect(() => {
    if (latitude && longitude && !hasTriedLocation) {
      console.log('✅ Geolocation success:', { latitude, longitude });
      setHasTriedLocation(true);
      onLocationDetected(latitude, longitude);
      
      // Hide status after 3 seconds
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    } else if (error && !hasTriedLocation) {
      console.warn('❌ Geolocation error:', error);
      setHasTriedLocation(true);
      
      // Fallback to default location (Tumakuru, India) immediately
      const defaultLat = 13.3419;
      const defaultLon = 77.1019;
      console.log('🏠 Using fallback location:', { lat: defaultLat, lon: defaultLon });
      onLocationDetected(defaultLat, defaultLon);
      
      // Hide status after 4 seconds
      setTimeout(() => {
        setShowStatus(false);
      }, 4000);
    } else if (!loading && !latitude && !longitude && !error && !hasTriedLocation) {
      // Handle cases where geolocation doesn't work but doesn't error either
      console.warn('⚠️ Geolocation timeout, using fallback');
      setHasTriedLocation(true);
      const defaultLat = 13.3419;
      const defaultLon = 77.1019;
      onLocationDetected(defaultLat, defaultLon);
      
      setTimeout(() => {
        setShowStatus(false);
      }, 4000);
    }
  }, [latitude, longitude, error, loading, hasTriedLocation, onLocationDetected]);

  if (!showStatus) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-md border
        ${loading 
          ? 'bg-blue-500/20 border-blue-300/30 text-blue-100' 
          : error 
            ? 'bg-orange-500/20 border-orange-300/30 text-orange-100'
            : 'bg-green-500/20 border-green-300/30 text-green-100'
        }
        transition-all duration-300 transform
      `}>
        {loading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full"></div>
            <span className="text-sm font-medium">{t.location.detecting}</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-4 h-4 text-orange-300" />
            <div className="text-sm">
              <div className="font-medium">{t.location.denied}</div>
              <div className="text-xs opacity-80">{t.location.useDefault}</div>
            </div>
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium">{t.location.detected}</span>
          </>
        )}
      </div>
    </div>
  );
};

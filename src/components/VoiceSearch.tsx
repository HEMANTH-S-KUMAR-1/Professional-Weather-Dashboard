import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translations, Language } from '../utils/translations';

interface VoiceSearchProps {
  onCityDetected: (cityName: string) => void;
  currentLanguage: Language;
  isDark?: boolean;
  className?: string;
}

export const VoiceSearch = ({ onCityDetected, currentLanguage, isDark = false, className = '' }: VoiceSearchProps) => {
  const [isActive, setIsActive] = useState(false);
  const t = translations[currentLanguage];

  // Map language codes to speech recognition languages
  const speechLanguageMap: Record<Language, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    kn: 'kn-IN',
  };

  const { isListening, transcript, error, isSupported, startListening, stopListening } = useSpeechRecognition({
    lang: speechLanguageMap[currentLanguage],
    continuous: false,
    interimResults: true,
  });

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
      setIsActive(false);
    } else {
      setIsActive(true);
      startListening((result: string) => {
        console.log('Voice recognition result:', result);
        // Clean up the result and pass it to the parent component
        const cleanedResult = result.trim().toLowerCase();
        if (cleanedResult) {
          onCityDetected(cleanedResult);
        }
        setIsActive(false);
      });
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <button
        onClick={handleVoiceSearch}
        disabled={!isSupported}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-lg
          ${isListening || isActive
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30 scale-105 ring-4 ring-red-300/20'
            : isDark
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-400/30'
          }
          ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
          backdrop-blur-md ring-1 ring-white/10
        `}
        title={isListening ? t.voiceSearch.stop : t.voiceSearch.start}
      >
        {isListening || isActive ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {/* Status indicator */}
      {(isListening || isActive) && (
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">
              {t.voiceSearch.listening}
            </span>
          </div>
          {transcript && (
            <div className="text-white/80 text-xs bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              {transcript}
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-red-300 text-xs text-center max-w-xs bg-red-500/20 px-2 py-1 rounded backdrop-blur-sm">
          {error}
        </div>
      )}
    </div>
  );
};

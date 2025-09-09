import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translations, Language } from '../utils/translations';

interface VoiceSearchProps {
  onCityDetected: (cityName: string) => void;
  currentLanguage: Language;
  className?: string;
}

export const VoiceSearch = ({ onCityDetected, currentLanguage, className = '' }: VoiceSearchProps) => {
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
          flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
          ${isListening || isActive
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110'
            : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
          }
          ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          backdrop-blur-md
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

import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../utils/translations';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  isDark: boolean;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn' as Language, name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  isDark
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md border transition-all duration-300
          ${isDark 
            ? 'bg-gray-800/40 border-gray-700/50 text-gray-200 hover:bg-gray-700/40' 
            : 'bg-white/40 border-white/30 text-gray-700 hover:bg-white/60'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang?.nativeName}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute top-full mt-2 w-40 rounded-lg backdrop-blur-md border overflow-hidden z-50
              ${isDark 
                ? 'bg-gray-800/90 border-gray-700/50' 
                : 'bg-white/90 border-white/30'
              }
            `}
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 transition-colors duration-200 flex flex-col
                  ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-white/50'}
                  ${currentLanguage === language.code 
                    ? (isDark ? 'bg-purple-600/20 text-purple-300' : 'bg-blue-500/20 text-blue-600')
                    : (isDark ? 'text-gray-200' : 'text-gray-700')
                  }
                `}
                whileHover={{ x: 2 }}
              >
                <span className="font-medium text-sm">{language.name}</span>
                <span className="text-xs opacity-70">{language.nativeName}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
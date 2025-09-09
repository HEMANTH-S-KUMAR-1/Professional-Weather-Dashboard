import React from 'react';
import { CloudOff, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotFoundPageProps {
  isDark: boolean;
  onBackToHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ isDark, onBackToHome }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex flex-col items-center justify-center text-center p-8 rounded-2xl
        ${isDark ? 'bg-gray-800/60 text-white' : 'bg-white/60 text-gray-800'}
      `}
    >
      <CloudOff size={80} className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
      
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      
      <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToHome}
        className={`
          flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors
          ${isDark 
            ? 'bg-blue-600 hover:bg-blue-500 text-white' 
            : 'bg-blue-500 hover:bg-blue-400 text-white'
          }
        `}
      >
        <Home size={18} />
        Back to Home
      </motion.button>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  isDark: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, isDark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        backdrop-blur-md rounded-2xl border p-8 text-center
        ${isDark 
          ? 'bg-red-900/20 border-red-700/30' 
          : 'bg-red-50/80 border-red-200/50'
        }
      `}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
      >
        <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
      </motion.div>
      
      <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-red-300' : 'text-red-600'}`}>
        Something went wrong
      </h2>
      
      <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {message}
      </p>
      
      {message.includes('API key') && (
        <div className={`mb-6 text-sm p-4 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          <p className="font-semibold">Possible Fix:</p>
          <p>Please make sure the OWM_API_KEY environment variable is set in your Cloudflare Pages dashboard.</p>
        </div>
      )}
      
      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
        Something went wrong
      </h3>
      
      <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors mx-auto
            ${isDark 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};
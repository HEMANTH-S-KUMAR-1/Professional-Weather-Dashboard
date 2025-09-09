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
          <p className="mt-2">Visit <a href="/api-test" className={`underline ${isDark ? 'text-blue-300' : 'text-blue-600'}`} target="_blank">API Test</a> to check your API key status.</p>
        </div>
      )}
      
      {message.includes('fetch') && (
        <div className={`mb-6 text-sm p-4 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          <p className="font-semibold">Network Issue:</p>
          <p>There seems to be a problem connecting to the weather data service.</p>
          <p className="mt-2">For detailed troubleshooting, visit <a href="/api-troubleshooting.html" className={`underline ${isDark ? 'text-blue-300' : 'text-blue-600'}`} target="_blank">API Troubleshooting Guide</a>.</p>
        </div>
      )}
      
      {message.includes('rate limit') && (
        <div className={`mb-6 text-sm p-4 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          <p className="font-semibold">Rate Limit Exceeded:</p>
          <p>You've reached the OpenWeatherMap API call limit (60 calls/minute for free accounts).</p>
          <p className="mt-2">Please wait a moment before trying again.</p>
        </div>
      )}
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center px-6 py-3 rounded-lg font-medium transition-colors mx-auto
            ${isDark 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
            }
          `}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

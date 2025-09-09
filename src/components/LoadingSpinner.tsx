import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  isDark: boolean;
  message: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isDark, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <motion.div
        className={`
          w-16 h-16 rounded-full border-4 mb-4
          ${isDark 
            ? 'border-gray-700 border-t-purple-500' 
            : 'border-gray-300 border-t-blue-500'
          }
        `}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative"
      >
        <div className={`${sizes[size]} relative`}>
          <Droplets className="h-full w-full text-primary-400" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-primary-400/20 rounded-full blur-sm"
          />
        </div>
      </motion.div>
      
      {text && (
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`${textSizes[size]} text-gray-400 font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
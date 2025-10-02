import React from 'react';
import { motion } from 'framer-motion';

const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  label,
  className = '',
  animated = true,
  striped = false,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  const variants = {
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-gray-500 to-gray-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
    info: 'from-cyan-500 to-cyan-600',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
  };

  const containerClasses = `
    w-full bg-gray-700/30 rounded-full overflow-hidden
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const fillClasses = `
    h-full bg-gradient-to-r transition-all duration-500 ease-out
    ${variants[variant]}
    ${striped ? 'bg-stripes' : ''}
    ${animated ? 'relative overflow-hidden' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={containerClasses} {...props}>
        <motion.div
          className={fillClasses}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const CircularProgress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = true,
  thickness = 8,
  className = '',
  children,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = 50 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const variants = {
    primary: 'stroke-blue-500',
    secondary: 'stroke-gray-500',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-500',
    info: 'stroke-cyan-500',
    gradient: 'stroke-purple-500',
  };

  const containerClasses = `
    relative inline-flex items-center justify-center
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses} {...props}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          className="text-gray-700/30"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          className={variants[variant]}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <span className="text-sm font-semibold text-white">
            {Math.round(percentage)}%
          </span>
        ))}
      </div>
    </div>
  );
};

export { CircularProgress };
export default Progress;
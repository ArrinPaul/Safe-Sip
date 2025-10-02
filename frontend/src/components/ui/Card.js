import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'default',
  size = 'md',
  hover = false,
  onClick,
  className = '',
  header,
  footer,
  title,
  subtitle,
  image,
  ...props
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300 transform-gpu backface-hidden';
  
  const variants = {
    default: 'glass border border-white/10',
    filled: 'bg-white shadow-medium border border-gray-200',
    outlined: 'bg-transparent border-2 border-gray-300',
    elevated: 'bg-white shadow-hard',
    glass: 'glass border border-white/20',
    gradient: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30',
    success: 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30',
    warning: 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30',
    danger: 'bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30',
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClasses = hover || onClick 
    ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer hover:border-white/20' 
    : '';

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${hoverClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const cardContent = (
    <>
      {image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img 
            src={image} 
            alt={title || 'Card image'} 
            className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {header && (
        <div className="mb-4 pb-4 border-b border-white/10">
          {header}
        </div>
      )}
      
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-semibold text-white mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {footer}
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {cardContent}
    </motion.div>
  );
};

export default Card;
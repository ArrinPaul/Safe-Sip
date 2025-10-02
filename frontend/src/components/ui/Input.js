import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  autoComplete,
  leftIcon,
  rightIcon,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseClasses = 'transition-all duration-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const variants = {
    default: 'bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 hover:bg-white/10',
    filled: 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50',
    outlined: 'bg-transparent border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50',
    glass: 'glass border-white/30 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-blue-400/50',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
    : '';
  
  const successClasses = success 
    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/50' 
    : '';

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  const inputClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${errorClasses}
    ${successClasses}
    ${disabledClasses}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || isPassword ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <motion.label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
            error ? 'text-red-400' : 
            success ? 'text-green-400' : 
            isFocused ? 'text-blue-400' : 
            'text-gray-300'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`text-sm ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}`}>
              {leftIcon}
            </span>
          </div>
        )}
        
        <motion.input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={inputClasses}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isPassword ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`text-sm hover:text-blue-400 transition-colors duration-200 ${
                  error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            ) : (
              <span className={`text-sm ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}`}>
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {(error || success || helperText) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1"
          >
            {error && (
              <p className="text-red-400 text-sm animate-shake">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm">{success}</p>
            )}
            {helperText && !error && !success && (
              <p className="text-gray-400 text-sm">{helperText}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
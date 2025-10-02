import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  icon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-600/20 text-gray-300 border border-gray-500/30',
    primary: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
    secondary: 'bg-gray-600/20 text-gray-300 border border-gray-500/30',
    success: 'bg-green-600/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-600/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    glass: 'glass text-white border-white/20',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const dotVariants = {
    default: 'bg-gray-400',
    primary: 'bg-blue-400',
    secondary: 'bg-gray-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    gradient: 'bg-purple-400',
    glass: 'bg-white',
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.span
      className={classes}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...props}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full mr-2 ${dotVariants[variant]}`} />
      )}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </motion.span>
  );
};

const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    online: { variant: 'success', children: 'Online', dot: true },
    offline: { variant: 'default', children: 'Offline', dot: true },
    pending: { variant: 'warning', children: 'Pending', dot: true },
    error: { variant: 'danger', children: 'Error', dot: true },
    loading: { variant: 'info', children: 'Loading', dot: true },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return <Badge {...config} {...props} />;
};

export { StatusBadge };
export default Badge;
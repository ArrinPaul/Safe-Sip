import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  animate = true,
  ...props
}) => {
  const baseClasses = 'bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded';
  
  const variants = {
    text: 'h-4',
    title: 'h-6',
    heading: 'h-8',
    avatar: 'rounded-full w-10 h-10',
    button: 'h-10 w-24',
    card: 'h-32',
    image: 'h-48',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
  };

  const animateClasses = animate ? 'animate-pulse' : '';

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${animateClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <motion.div
      className={classes}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    />
  );
};

const SkeletonGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Pre-built skeleton layouts
const CardSkeleton = ({ showImage = true, className = '', ...props }) => (
  <SkeletonGroup className={`p-6 glass rounded-xl ${className}`} {...props}>
    {showImage && <Skeleton variant="image" className="mb-4" />}
    <Skeleton variant="title" className="mb-2" />
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" width="60%" />
  </SkeletonGroup>
);

const ListSkeleton = ({ items = 3, className = '', ...props }) => (
  <SkeletonGroup className={className} {...props}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="75%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
    ))}
  </SkeletonGroup>
);

const TableSkeleton = ({ rows = 5, columns = 4, className = '', ...props }) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" className="flex-1 h-6" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

const DashboardSkeleton = ({ className = '', ...props }) => (
  <div className={`space-y-6 ${className}`} {...props}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <Skeleton variant="heading" width="200px" />
      <Skeleton variant="button" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="glass p-6 rounded-xl">
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="title" width="40%" className="mb-2" />
          <Skeleton variant="text" width="80%" />
        </div>
      ))}
    </div>
    
    {/* Chart */}
    <div className="glass p-6 rounded-xl">
      <Skeleton variant="title" width="150px" className="mb-4" />
      <Skeleton variant="image" height="300px" />
    </div>
    
    {/* Table */}
    <div className="glass p-6 rounded-xl">
      <Skeleton variant="title" width="120px" className="mb-4" />
      <TableSkeleton rows={8} />
    </div>
  </div>
);

export {
  SkeletonGroup,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  DashboardSkeleton,
};

export default Skeleton;
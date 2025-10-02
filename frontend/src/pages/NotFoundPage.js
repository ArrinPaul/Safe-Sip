import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Droplets } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md w-full"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl font-bold gradient-text"
            >
              404
            </motion.div>
            
            {/* Floating droplets */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4"
            >
              <Droplets className="h-6 w-6 text-primary-400" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-2 -left-6"
            >
              <Droplets className="h-4 w-4 text-success-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold text-white">
            Page Not Found
          </h1>
          
          <p className="text-gray-400 text-lg leading-relaxed">
            Oops! The page you're looking for seems to have evaporated. 
            Don't worry, let's get you back to safer waters.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-6 glass rounded-2xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Looking for something specific?
          </h2>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link 
              to="/dashboard" 
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              → Dashboard
            </Link>
            <Link 
              to="/analytics" 
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              → Analytics
            </Link>
            <Link 
              to="/workflow" 
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              → Workflow
            </Link>
            <Link 
              to="/reports" 
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              → Reports
            </Link>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-gray-500 text-sm"
        >
          If you believe this is an error, please contact the SafeSip support team.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
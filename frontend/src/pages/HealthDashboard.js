import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';

const HealthDashboard = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Activity className="h-16 w-16 text-error-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Health Official Dashboard</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive health oversight and policy management interface for health officials.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthDashboard;
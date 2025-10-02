import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, TrendingUp, MapPin } from 'lucide-react';

const PHCDashboard = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Users className="h-16 w-16 text-success-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">PHC Dashboard</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Primary Health Center management dashboard with advanced analytics and real-time monitoring.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PHCDashboard;
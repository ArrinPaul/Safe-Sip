import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const ReportsPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <FileText className="h-16 w-16 text-warning-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Reports & Documentation</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Generate comprehensive reports and manage documentation for health monitoring.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;
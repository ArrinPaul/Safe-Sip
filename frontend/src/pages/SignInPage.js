import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
      >
        <div className="hidden lg:block">
          <div className="glass rounded-3xl p-10">
            <div className="flex items-center space-x-3 mb-6">
              <Droplets className="h-10 w-10 text-blue-400" />
              <span className="text-3xl font-bold gradient-text">SafeSip</span>
            </div>
            <h2 className="text-white text-3xl font-bold mb-3">Welcome back</h2>
            <p className="text-gray-300">Sign in to access your dashboards, analytics, and reports.</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-2xl">
                <div className="text-white font-semibold text-lg">Secure</div>
                <div className="text-gray-600">Industry-standard authentication</div>
              </div>
              <div className="glass-card p-4 rounded-2xl">
                <div className="text-white font-semibold text-lg">Fast</div>
                <div className="text-gray-600">Quick access to insights</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto">
          <div className="glass-card rounded-3xl p-6">
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" appearance={{ variables: { colorPrimary: '#2563eb' } }} />
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium">Create one</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;



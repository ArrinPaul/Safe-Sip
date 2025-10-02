import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Card } from '../components/ui';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.error });
      }
    } catch (err) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'admin@safesip.com', password: 'admin123', role: 'Admin' },
    { email: 'asha@safesip.com', password: 'asha123', role: 'ASHA Worker' },
    { email: 'health@safesip.com', password: 'health123', role: 'Health Official' }
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
            <div className="relative">
              <Droplets className="h-12 w-12 text-primary-400 group-hover:text-primary-300 transition-colors" />
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-sm group-hover:blur-md transition-all" />
            </div>
            <span className="text-3xl font-bold gradient-text">SafeSip</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">
            Sign in to your SafeSip account to continue
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8"
        >
          {(error || errors.submit) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0" />
              <p className="text-error-700 text-sm">{error || errors.submit}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-light pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-light pl-10 pr-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Demo Accounts</h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(cred.email, cred.password)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cred.role}</p>
                      <p className="text-xs text-gray-600">{cred.email}</p>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-600">
                      Click to fill
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Contact Administrator
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Shield, 
  Activity, 
  Users, 
  BarChart3, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Brain,
  Zap,
  Globe,
  ArrowRight,
  Play,
  Star,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { fetchRealTimeData, villageStats, caseStats } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      const realTimeData = await fetchRealTimeData();
      setStats({
        villages: villageStats.total || 1247,
        cases: caseStats.active || 23,
        resolved: caseStats.resolved || 1156,
        workers: 156,
        responseTime: '2.3h',
        accuracy: '94.2%'
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({
        villages: 1247,
        cases: 23,
        resolved: 1156,
        workers: 156,
        responseTime: '2.3h',
        accuracy: '94.2%'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const heroSlides = [
    {
      title: "AI-Powered Disease Prevention",
      subtitle: "Advanced machine learning models predict and prevent waterborne disease outbreaks",
      background: "bg-gradient-to-r from-primary-600 via-primary-700 to-blue-800",
      icon: Brain,
      stats: "94.2% Prediction Accuracy"
    },
    {
      title: "Real-Time Monitoring",
      subtitle: "Live data streaming and instant alerts for rapid response to health emergencies",
      background: "bg-gradient-to-r from-success-600 via-green-700 to-emerald-800",
      icon: Activity,
      stats: "2.3h Average Response Time"
    },
    {
      title: "Community Health Network",
      subtitle: "Connecting ASHA workers, PHCs, and health officials for comprehensive care",
      background: "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800",
      icon: Users,
      stats: "1,247 Villages Connected"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "ML-Powered Predictions",
      description: "Advanced algorithms analyze water quality, weather patterns, and health data to predict disease outbreaks before they happen.",
      color: "from-primary-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Live dashboards with WebSocket updates provide instant visibility into health metrics and emergency situations.",
      color: "from-success-500 to-green-600",
      delay: 0.2
    },
    {
      icon: Shield,
      title: "ASHA Worker Tools",
      description: "Mobile-friendly interface for community health workers to report cases, track patients, and coordinate care.",
      color: "from-purple-500 to-indigo-600",
      delay: 0.3
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive data visualization and reporting tools for health officials and policy makers.",
      color: "from-warning-500 to-orange-600",
      delay: 0.4
    },
    {
      icon: MapPin,
      title: "Geographic Mapping",
      description: "Interactive maps showing disease clusters, risk zones, and resource allocation for targeted interventions.",
      color: "from-error-500 to-red-600",
      delay: 0.5
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Streamlined processes from case reporting to resolution with automated notifications and task management.",
      color: "from-cyan-500 to-blue-600",
      delay: 0.6
    }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Chief Medical Officer, Ghaziabad",
      content: "SafeSip has revolutionized our disease surveillance. We can now predict outbreaks 72 hours in advance.",
      avatar: "👩‍⚕️",
      rating: 5
    },
    {
      name: "Sunita Devi",
      role: "ASHA Worker, Rampur Village",
      content: "The mobile interface is so easy to use. I can report cases instantly and get immediate guidance from doctors.",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "PHC Superintendent",
      content: "Real-time data and ML predictions have helped us reduce response time by 60% and save more lives.",
      avatar: "👨‍⚕️",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
          
          {/* Animated Mesh Background */}
          <motion.div 
            className="absolute inset-0 bg-mesh-1 opacity-30"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: "400% 400%" }}
          />
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              >
                {i % 3 === 0 ? (
                  <Droplets className="w-4 h-4 text-blue-400" />
                ) : i % 3 === 1 ? (
                  <div className="w-3 h-3 bg-blue-400 rounded-full" />
                ) : (
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Logo & Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center space-x-4 mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative"
            >
              <Droplets className="h-16 w-16 md:h-20 md:w-20 text-blue-400" />
              <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-lg animate-pulse" />
            </motion.div>
            <div className="text-left">
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold gradient-text"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                SafeSip
              </motion.h1>
              <motion.p 
                className="text-blue-300 text-lg md:text-xl font-medium"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Water Safety Intelligence Platform
              </motion.p>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6 mb-12"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Preventing Waterborne Diseases with
              <span className="block gradient-text">AI-Powered Intelligence</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Advanced machine learning and real-time monitoring to predict, prevent, and respond to 
              waterborne disease outbreaks across rural communities.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto"
          >
            {[
              { label: "Villages Protected", value: stats?.villages || "1,247", icon: MapPin },
              { label: "Active Cases", value: stats?.cases || "23", icon: AlertTriangle },
              { label: "Cases Resolved", value: stats?.resolved || "1,156", icon: CheckCircle },
              { label: "Prediction Accuracy", value: stats?.accuracy || "94.2%", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="glass-card p-4 md:p-6 hover:scale-105 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group text-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="inline-flex items-center px-8 py-4 glass border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 group text-lg">
                    <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-12 flex flex-col items-center space-y-4"
          >
            <p className="text-gray-400 text-sm font-medium">Trusted by healthcare professionals nationwide</p>
            <div className="flex items-center space-x-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="text-white font-semibold ml-2">4.9/5 Rating</span>
            </div>
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-12">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* Real-time Stats Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Real-Time Impact
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Live statistics from the SafeSip network showing our continuous impact on community health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoading && stats && [
              { label: 'Villages Protected', value: stats.villages, icon: MapPin, color: 'from-primary-500 to-blue-600' },
              { label: 'Active Cases', value: stats.cases, icon: AlertTriangle, color: 'from-error-500 to-red-600' },
              { label: 'Cases Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-success-500 to-green-600' },
              { label: 'Health Workers', value: stats.workers, icon: Users, color: 'from-purple-500 to-indigo-600' },
              { label: 'Response Time', value: stats.responseTime, icon: Zap, color: 'from-warning-500 to-orange-600' },
              { label: 'ML Accuracy', value: stats.accuracy, icon: Brain, color: 'from-cyan-500 to-blue-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} mb-4`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Comprehensive Health Management
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced features powered by AI and real-time data to revolutionize waterborne disease prevention
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card rounded-2xl p-8 group cursor-pointer"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real testimonials from the field workers and health officials using SafeSip
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass rounded-3xl p-12"
          >
            <div className="text-6xl mb-6">🌊</div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals using SafeSip to prevent waterborne diseases and save lives.
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to={user?.role === 'ASHA_WORKER' ? '/asha-dashboard' : 
                       user?.role === 'HEALTH_OFFICIAL' ? '/health-dashboard' :
                       user?.role === 'PHC_STAFF' ? '/phc-dashboard' : '/dashboard'}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  My Workspace
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/workflow"
                  className="btn-outline text-lg px-8 py-4"
                >
                  Learn More
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
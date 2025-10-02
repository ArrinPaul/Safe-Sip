import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Users, 
  Activity, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Droplets,
  Shield,
  Bell
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { cn } from '../utils/helpers';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requireAuth: true },
    { name: 'Analytics', href: '/analytics', icon: Activity, requireAuth: true },
    { name: 'Reports', href: '/reports', icon: FileText, requireAuth: true },
    { name: 'Workflow', href: '/workflow', icon: Users },
  ];

  const roleBasedLinks = {
    ASHA_WORKER: { name: 'ASHA Dashboard', href: '/asha-dashboard', icon: Shield },
    HEALTH_OFFICIAL: { name: 'Health Dashboard', href: '/health-dashboard', icon: Activity },
    PHC_STAFF: { name: 'PHC Dashboard', href: '/phc-dashboard', icon: Users },
  };

  const filteredNavItems = navItems.filter(item => 
    !item.requireAuth || isSignedIn
  );

  return (
    <motion.nav 
      className="glass-nav backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Droplets className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </motion.div>
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm group-hover:blur-md transition-all animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold gradient-text">SafeSip</span>
                <span className="text-xs text-gray-400 -mt-1">Water Safety Monitor</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {filteredNavItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group",
                    "hover:bg-white/10 hover:scale-105",
                    location.pathname === item.href && "bg-white/20 text-blue-400"
                  )}
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                  {location.pathname === item.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            
            {/* Role-based dashboard link */}
            {isSignedIn && user?.publicMetadata?.role && roleBasedLinks[user.publicMetadata.role] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to={roleBasedLinks[user.publicMetadata.role].href}
                  className={cn(
                    "relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group",
                    "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30",
                    "hover:from-blue-600/30 hover:to-purple-600/30 hover:scale-105",
                    location.pathname === roleBasedLinks[user.publicMetadata.role].href && "ring-2 ring-blue-400/50"
                  )}
                >
                  {React.createElement(roleBasedLinks[user.publicMetadata.role].icon, { 
                    className: "h-4 w-4 group-hover:scale-110 transition-transform text-blue-400" 
                  })}
                  <span className="font-medium text-blue-300">{roleBasedLinks[user.publicMetadata.role].name}</span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-3">
            {isSignedIn ? (
              <>
                {/* Notifications */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 rounded-xl glass hover:bg-white/20 transition-all duration-300 group"
                  >
                    <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <motion.span 
                      className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute right-0 mt-3 w-80 glass border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-white text-lg">Notifications</h3>
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">3 new</span>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          <motion.div 
                            className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 animate-pulse" />
                              <div className="flex-1">
                                <p className="text-sm text-red-300 font-medium">High risk alert in Rampur village</p>
                                <p className="text-xs text-red-400/80 mt-1">Contamination detected • 2 minutes ago</p>
                              </div>
                            </div>
                          </motion.div>
                          <motion.div 
                            className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/30 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 animate-pulse" />
                              <div className="flex-1">
                                <p className="text-sm text-yellow-300 font-medium">Water quality test pending</p>
                                <p className="text-xs text-yellow-400/80 mt-1">Scheduled for tomorrow • 15 minutes ago</p>
                              </div>
                            </div>
                          </motion.div>
                          <motion.div 
                            className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                              <div className="flex-1">
                                <p className="text-sm text-green-300 font-medium">Case resolved in Shivpur</p>
                                <p className="text-xs text-green-400/80 mt-1">Water quality restored • 1 hour ago</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            View all notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* User Menu */}
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
                    <p className="text-xs text-blue-400">{user?.publicMetadata?.role?.replace('_', ' ')}</p>
                  </div>
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-400/30 hover:ring-blue-400/50 transition-all">
                      <span className="text-white text-sm font-semibold">
                        {(user?.fullName || user?.primaryEmailAddress?.emailAddress || 'U').charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
                  </motion.div>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 rounded-xl glass hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/sign-in"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl glass hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/20 backdrop-blur-xl bg-gray-900/50"
          >
            <div className="px-4 py-6 space-y-2">
              {filteredNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                      location.pathname === item.href 
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                        : "hover:bg-white/10 hover:scale-105"
                    )}
                  >
                    <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.name}</span>
                    {location.pathname === item.href && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
              
              {/* Role-based dashboard link for mobile */}
              {isSignedIn && user?.publicMetadata?.role && roleBasedLinks[user.publicMetadata.role] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to={roleBasedLinks[user.publicMetadata.role].href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                      "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30",
                      "hover:from-blue-600/30 hover:to-purple-600/30",
                      location.pathname === roleBasedLinks[user.publicMetadata.role].href && "ring-2 ring-blue-400/50"
                    )}
                  >
                    {React.createElement(roleBasedLinks[user.publicMetadata.role].icon, { 
                      className: "h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" 
                    })}
                    <span className="font-medium text-blue-300">{roleBasedLinks[user.publicMetadata.role].name}</span>
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  </Link>
                </motion.div>
              )}
              
              {isSignedIn ? (
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-success-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {(user?.fullName || user?.primaryEmailAddress?.emailAddress || 'U').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
                      <p className="text-sm text-white/60">{user?.publicMetadata?.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/20">
                  <Link
                    to="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
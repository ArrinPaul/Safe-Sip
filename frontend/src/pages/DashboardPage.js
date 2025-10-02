import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  MapPin, 
  AlertTriangle,
  Droplets,
  Shield,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bell,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, Button, Badge, Progress, Skeleton } from '../components/ui';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { dashboardData, loading } = useData();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Please log in to access the dashboard" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Villages',
      value: '1,247',
      change: '+12%',
      changeValue: '+156 villages',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      trend: 'up',
      description: 'Villages under monitoring'
    },
    {
      title: 'Active Cases',
      value: '23',
      change: '-18%',
      changeValue: '-5 cases',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      trend: 'down',
      description: 'Current disease cases'
    },
    {
      title: 'Health Workers',
      value: '156',
      change: '+8%',
      changeValue: '+12 workers',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      trend: 'up',
      description: 'Active ASHA workers'
    },
    {
      title: 'Response Rate',
      value: '94.2%',
      change: '+5.2%',
      changeValue: '+4.9% improvement',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      trend: 'up',
      description: 'Average response time'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 2000);
  };

  const timeFrameOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 3 months', value: '3m' },
    { label: 'Last year', value: '1y' }
  ];

  const recentActivities = [
    { 
      type: 'alert', 
      message: 'High risk detected in Rampur Village', 
      time: '2 min ago', 
      severity: 'high',
      icon: AlertTriangle,
      color: 'red'
    },
    { 
      type: 'update', 
      message: 'Water quality test completed in Shivpur', 
      time: '15 min ago', 
      severity: 'normal',
      icon: Droplets,
      color: 'blue'
    },
    { 
      type: 'report', 
      message: 'Weekly health report generated', 
      time: '1 hour ago', 
      severity: 'normal',
      icon: BarChart3,
      color: 'green'
    },
    { 
      type: 'case', 
      message: 'New case reported by ASHA worker', 
      time: '2 hours ago', 
      severity: 'medium',
      icon: Users,
      color: 'orange'
    }
  ];

  const riskAreas = [
    { name: 'Rampur Village', risk: 85, cases: 8, population: '2.4K' },
    { name: 'Shivpur', risk: 62, cases: 3, population: '1.8K' },
    { name: 'Bharatpur', risk: 45, cases: 1, population: '3.2K' },
    { name: 'Gokul Village', risk: 28, cases: 0, population: '1.5K' }
  ];

  const systemStatus = [
    { name: 'API Status', status: 'online', color: 'green' },
    { name: 'Real-time Data', status: 'active', color: 'green' },
    { name: 'ML Models', status: 'running', color: 'green' },
    { name: 'Database', status: 'syncing', color: 'yellow' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-gray-600 text-lg">
                Here's what's happening with SafeSip today
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select
                value={selectedTimeFrame}
                onChange={(e) => setSelectedTimeFrame(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeFrameOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="md"
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative overflow-hidden"
            >
              <Card variant="glass" className="p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    variant={stat.trend === 'up' ? 'success' : 'error'}
                    className="flex items-center space-x-1"
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{stat.change}</span>
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                  <p className="text-xs text-gray-400">{stat.changeValue}</p>
                </div>

                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <span>Recent Activity</span>
                </h2>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                      >
                        <div className={`p-2 rounded-lg bg-${activity.color}-100`}>
                          <Icon className={`w-5 h-5 text-${activity.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.message}</p>
                          <p className="text-gray-500 text-sm">{activity.time}</p>
                        </div>
                        {activity.severity === 'high' && (
                          <Badge variant="error" size="sm">High Priority</Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Quick Actions</span>
              </h2>
              
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full justify-between"
                >
                  <span>Generate Report</span>
                  <BarChart3 className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full justify-between"
                >
                  <span>View Analytics</span>
                  <TrendingUp className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full justify-between"
                >
                  <span>Monitor Villages</span>
                  <MapPin className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            {/* Risk Areas */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>High Risk Areas</span>
              </h2>
              
              <div className="space-y-4">
                {riskAreas.map((area, index) => (
                  <motion.div
                    key={area.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{area.name}</h3>
                      <Badge 
                        variant={area.risk > 70 ? 'error' : area.risk > 40 ? 'warning' : 'success'}
                        size="sm"
                      >
                        {area.risk}% Risk
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={area.risk} 
                        variant={area.risk > 70 ? 'error' : area.risk > 40 ? 'warning' : 'success'}
                        size="sm"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{area.cases} active cases</span>
                        <span>{area.population} population</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* System Status */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>System Status</span>
              </h2>
              
              <div className="space-y-4">
                {systemStatus.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600">{item.name}</span>
                    <Badge 
                      variant={item.color === 'green' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Eye,
  Users,
  AlertTriangle,
  MapPin,
  Droplets,
  Activity,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '../components/ui';

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('cases');
  const [showFilters, setShowFilters] = useState(false);

  const periods = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 3 months', value: '3m' },
    { label: 'Last year', value: '1y' }
  ];

  const metrics = [
    { label: 'Disease Cases', value: 'cases', icon: AlertTriangle },
    { label: 'Water Quality', value: 'water', icon: Droplets },
    { label: 'Population Health', value: 'population', icon: Users },
    { label: 'Risk Assessment', value: 'risk', icon: Activity }
  ];

  const keyMetrics = [
    {
      title: 'Total Cases',
      current: 234,
      previous: 198,
      change: 18.2,
      trend: 'up',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Prevention Rate',
      current: 87.5,
      previous: 82.1,
      change: 6.6,
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Response Time',
      current: 2.4,
      previous: 3.1,
      change: -22.6,
      trend: 'down',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Coverage Area',
      current: 156,
      previous: 142,
      change: 9.9,
      trend: 'up',
      icon: MapPin,
      color: 'purple'
    }
  ];

  const trendingIssues = [
    { issue: 'Cholera outbreak in Northern districts', severity: 'high', cases: 45, trend: 'up' },
    { issue: 'Water contamination in Rampur village', severity: 'medium', cases: 12, trend: 'stable' },
    { issue: 'Typhoid cases increasing in urban areas', severity: 'medium', cases: 23, trend: 'up' },
    { issue: 'Dengue prevention campaign results', severity: 'low', cases: 8, trend: 'down' }
  ];

  const geographicData = [
    { region: 'North District', cases: 89, change: 15.2, risk: 85 },
    { region: 'South District', cases: 67, change: -12.4, risk: 62 },
    { region: 'East District', cases: 45, change: 8.9, risk: 45 },
    { region: 'West District', cases: 33, change: -5.1, risk: 38 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
              </div>
              <p className="text-gray-600 text-lg">
                Advanced insights and data visualization for disease monitoring and prevention
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
                
                <Button variant="outline" size="md" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                
                <Button variant="outline" size="md" className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
                    <div className="space-y-2">
                      {metrics.map(metric => {
                        const Icon = metric.icon;
                        return (
                          <label key={metric.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="metric"
                              value={metric.value}
                              checked={selectedMetric === metric.value}
                              onChange={(e) => setSelectedMetric(e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{metric.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {keyMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div key={metric.title} variants={itemVariants}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                      <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                    </div>
                    <Badge
                      variant={metric.trend === 'up' ? 'success' : 'error'}
                      className="flex items-center space-x-1"
                    >
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>{Math.abs(metric.change)}%</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {metric.title === 'Response Time' ? `${metric.current}h` : 
                       metric.title === 'Prevention Rate' ? `${metric.current}%` : 
                       metric.current}
                    </h3>
                    <p className="text-gray-600 font-medium">{metric.title}</p>
                    <p className="text-sm text-gray-500">
                      vs {metric.previous} last period
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 h-96">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <span>Trend Analysis</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Live Data</Badge>
                  <Badge variant="success">Updated</Badge>
                </div>
              </div>
              
              {/* Placeholder for Chart */}
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Interactive Chart</p>
                  <p className="text-gray-500 text-sm">Data visualization will be displayed here</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Trending Issues */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Trending Issues</span>
              </h2>
              
              <div className="space-y-4">
                {trendingIssues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {issue.issue}
                      </h3>
                      <Badge 
                        variant={
                          issue.severity === 'high' ? 'error' : 
                          issue.severity === 'medium' ? 'warning' : 'success'
                        }
                        size="sm"
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{issue.cases} cases</span>
                      <div className="flex items-center space-x-1">
                        {issue.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-red-500" />
                        ) : issue.trend === 'down' ? (
                          <TrendingDown className="w-3 h-3 text-green-500" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full" />
                        )}
                        <span className="capitalize">{issue.trend}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Geographic Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-green-600" />
              <span>Geographic Analysis</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {geographicData.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{region.region}</h3>
                    <Badge 
                      variant={region.risk > 70 ? 'error' : region.risk > 40 ? 'warning' : 'success'}
                      size="sm"
                    >
                      {region.risk}% Risk
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{region.cases}</span>
                      <div className="flex items-center space-x-1">
                        {region.change > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-red-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-green-500" />
                        )}
                        <span className={`text-sm ${region.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {Math.abs(region.change)}%
                        </span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={region.risk} 
                      variant={region.risk > 70 ? 'error' : region.risk > 40 ? 'warning' : 'success'}
                      size="sm"
                    />
                    
                    <p className="text-sm text-gray-600">Active cases this period</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
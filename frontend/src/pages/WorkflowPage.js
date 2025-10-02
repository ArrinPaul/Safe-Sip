import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const WorkflowPage = () => {
  const workflowSteps = [
    {
      id: 1,
      title: 'Community Reporting',
      description: 'Citizens report health issues via app or helpline',
      status: 'completed',
      icon: '📱'
    },
    {
      id: 2,
      title: 'ASHA Worker Response',
      description: 'ASHA workers verify and assess the situation',
      status: 'active',
      icon: '👩‍⚕️'
    },
    {
      id: 3,
      title: 'Data Analysis',
      description: 'AI analyzes patterns and risk factors',
      status: 'pending',
      icon: '🤖'
    },
    {
      id: 4,
      title: 'Health Official Review',
      description: 'Health officials coordinate response',
      status: 'pending',
      icon: '👨‍💼'
    },
    {
      id: 5,
      title: 'PHC Intervention',
      description: 'Primary Health Centers provide treatment',
      status: 'pending',
      icon: '🏥'
    },
    {
      id: 6,
      title: 'Follow-up & Monitoring',
      description: 'Continuous monitoring and prevention',
      status: 'pending',
      icon: '📊'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-success-500" />;
      case 'active':
        return <Clock className="h-6 w-6 text-warning-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-success-500 bg-success-50';
      case 'active':
        return 'border-warning-500 bg-warning-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <GitBranch className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">SafeSip Workflow</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Streamlined waterborne disease management process from community reporting to resolution
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="space-y-6">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-12 top-20 w-0.5 h-12 bg-gray-600 z-0" />
              )}

              <div className={`glass-card rounded-2xl p-6 border-l-4 ${getStatusColor(step.status)} relative z-10`}>
                <div className="flex items-start space-x-4">
                  {/* Step Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-success-500 rounded-full flex items-center justify-center text-2xl">
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Step {step.id}: {step.title}
                      </h3>
                      {getStatusIcon(step.status)}
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            step.status === 'completed' 
                              ? 'bg-success-500 w-full' 
                              : step.status === 'active' 
                                ? 'bg-warning-500 w-1/2' 
                                : 'bg-gray-400 w-0'
                          }`}
                        />
                      </div>
                      <span className={`text-sm font-medium ${
                        step.status === 'completed' 
                          ? 'text-success-600' 
                          : step.status === 'active' 
                            ? 'text-warning-600' 
                            : 'text-gray-500'
                      }`}>
                        {step.status === 'completed' 
                          ? 'Completed' 
                          : step.status === 'active' 
                            ? 'In Progress' 
                            : 'Pending'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">94.2%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">2.3h</div>
            <div className="text-gray-600">Avg Response Time</div>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">1,247</div>
            <div className="text-gray-600">Cases Processed</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkflowPage;
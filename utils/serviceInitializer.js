const logger = require('./logger');
const emailService = require('./emailService');
const mlService = require('./mlService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Service initialization
const initializeServices = async () => {
  try {
    logger.info('Initializing SafeSip services...');

    // Initialize database connection
    await initializeDatabase();

    // Initialize email service
    await initializeEmailService();

    // Initialize ML models
    await initializeMLModels();

    // Initialize cron jobs
    await initializeCronJobs();

    // Initialize monitoring
    await initializeMonitoring();

    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Service initialization failed:', error);
    throw error;
  }
};

// Database initialization
const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

// Email service initialization
const initializeEmailService = async () => {
  try {
    const isConnected = await emailService.verifyConnection();
    if (isConnected) {
      logger.info('Email service initialized');
    } else {
      logger.warn('Email service not available - emails will not be sent');
    }
  } catch (error) {
    logger.error('Email service initialization failed:', error);
    // Don't throw - email is not critical for app functionality
  }
};

// ML models initialization
const initializeMLModels = async () => {
  try {
    if (mlService && typeof mlService.initializeModels === 'function') {
      await mlService.initializeModels();
      logger.info('ML models initialized');
    } else {
      logger.warn('ML service not available');
    }
  } catch (error) {
    logger.error('ML models initialization failed:', error);
    // Don't throw - ML is not critical for basic app functionality
  }
};

// Cron jobs initialization
const initializeCronJobs = async () => {
  try {
    const cron = require('node-cron');

    // Health check every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      performHealthCheck();
    });

    // Data cleanup every day at 2 AM
    cron.schedule('0 2 * * *', () => {
      performDataCleanup();
    });

    // Generate daily reports at 6 AM
    cron.schedule('0 6 * * *', () => {
      generateDailyReports();
    });

    // Check for health alerts every 10 minutes
    cron.schedule('*/10 * * * *', () => {
      checkHealthAlerts();
    });

    logger.info('Cron jobs initialized');
  } catch (error) {
    logger.error('Cron jobs initialization failed:', error);
    // Don't throw - cron jobs are not critical
  }
};

// Monitoring initialization
const initializeMonitoring = async () => {
  try {
    // Set up process monitoring
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      // Don't exit in production - log and continue
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Memory monitoring
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
        external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100
      };

      // Log if memory usage is high
      if (memUsageMB.rss > 500) { // 500MB
        logger.warn('High memory usage detected', memUsageMB);
      }
    }, 60000); // Check every minute

    logger.info('Monitoring initialized');
  } catch (error) {
    logger.error('Monitoring initialization failed:', error);
    // Don't throw - monitoring is not critical
  }
};

// Health check function
const performHealthCheck = async () => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    // Check email service
    await emailService.verifyConnection();
    
    logger.debug('Health check completed');
  } catch (error) {
    logger.error('Health check failed:', error);
  }
};

// Data cleanup function
const performDataCleanup = async () => {
  try {
    logger.info('Starting data cleanup...');

    // Clean up old sessions (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    await prisma.userSession.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    // Clean up old notifications (older than 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo
        },
        isRead: true
      }
    });

    logger.info('Data cleanup completed');
  } catch (error) {
    logger.error('Data cleanup failed:', error);
  }
};

// Generate daily reports function
const generateDailyReports = async () => {
  try {
    logger.info('Generating daily reports...');

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate reports for active users
    const activeUsers = await prisma.user.findMany({
      where: {
        isActive: true,
        role: {
          in: ['ADMIN', 'HEALTH_OFFICIAL']
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true
      }
    });

    for (const user of activeUsers) {
      const reportData = {
        title: 'Daily Health Summary',
        type: 'Daily Report',
        period: yesterday.toDateString(),
        timestamp: new Date(),
        summary: 'Daily health monitoring report with key statistics and alerts.'
      };

      await emailService.sendReportNotification(user.email, user.firstName, reportData);
    }

    logger.info('Daily reports generated');
  } catch (error) {
    logger.error('Daily report generation failed:', error);
  }
};

// Check health alerts function
const checkHealthAlerts = async () => {
  try {
    // This would typically check for various health conditions
    // and send alerts when thresholds are exceeded
    
    // Example: Check for high disease case counts
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    // In a real implementation, you would:
    // 1. Query recent health reports
    // 2. Apply ML models to detect anomalies
    // 3. Send alerts to relevant users
    
    logger.debug('Health alerts check completed');
  } catch (error) {
    logger.error('Health alerts check failed:', error);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    logger.info('Starting graceful shutdown...');

    // Close database connection
    await prisma.$disconnect();
    logger.info('Database connection closed');

    // Close other connections
    // Add other cleanup tasks here

    logger.info('Graceful shutdown completed');
  } catch (error) {
    logger.error('Graceful shutdown failed:', error);
  }
};

module.exports = {
  initializeServices,
  gracefulShutdown,
  performHealthCheck,
  performDataCleanup,
  generateDailyReports,
  checkHealthAlerts
};
// Test server to identify issues
const express = require('express');
const path = require('path');
require('dotenv').config();

console.log('Starting test server...');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'SafeSip Test Server is running!',
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down test server...');
    process.exit(0);
});
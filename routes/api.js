const express = require('express');
const router = express.Router();
const apiService = require('../utils/apiService');
const mlService = require('../utils/mlService');
const logger = require('../utils/logger');

// Require auth for protected API routes
router.use((req, res, next) => {
    if (!req.auth || !req.auth.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next();
});

// Real-time data endpoint
router.get('/realtime-data', async (req, res) => {
    try {
        const location = req.query.location || 'Delhi';
        const data = await apiService.getAggregatedData(location);
        
        if (data) {
            res.json({
                success: true,
                data: data,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch real-time data'
            });
        }
    } catch (error) {
        logger.error('Real-time data API error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Weather data endpoint
router.get('/weather/:location?', async (req, res) => {
    try {
        const location = req.params.location || 'Delhi';
        const weather = await apiService.getWeatherData(location);
        
        res.json({
            success: true,
            data: weather,
            location: location
        });
    } catch (error) {
        logger.error('Weather API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather data'
        });
    }
});

// Health data endpoint
router.get('/health/:state?', async (req, res) => {
    try {
        const state = req.params.state || 'Delhi';
        const health = await apiService.getHealthData(state);
        
        res.json({
            success: true,
            data: health,
            state: state
        });
    } catch (error) {
        logger.error('Health data API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch health data'
        });
    }
});

// Water quality endpoint
router.get('/water-quality/:region?', async (req, res) => {
    try {
        const region = req.params.region || 'Delhi';
        const waterQuality = await apiService.getWaterQualityData(region);
        
        res.json({
            success: true,
            data: waterQuality,
            region: region
        });
    } catch (error) {
        logger.error('Water quality API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch water quality data'
        });
    }
});

// Disease outbreak endpoint
router.get('/disease-outbreaks/:region?', async (req, res) => {
    try {
        const region = req.params.region || 'Delhi';
        const disease = await apiService.getDiseaseOutbreakData(region);
        
        res.json({
            success: true,
            data: disease,
            region: region
        });
    } catch (error) {
        logger.error('Disease outbreak API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch disease outbreak data'
        });
    }
});

// ML Prediction endpoint
router.post('/predict', async (req, res) => {
    try {
        const { features, modelType = 'disease' } = req.body;
        
        if (!features) {
            return res.status(400).json({
                success: false,
                message: 'Features array is required'
            });
        }
        
        const prediction = await mlService.predict(features, modelType);
        
        if (prediction) {
            res.json({
                success: true,
                prediction: prediction,
                modelType: modelType
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Prediction failed'
            });
        }
    } catch (error) {
        logger.error('ML prediction API error:', error);
        res.status(500).json({
            success: false,
            message: 'Prediction service error'
        });
    }
});

// Risk Assessment endpoint
router.post('/risk-assessment', async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Data object is required'
            });
        }
        
        const riskAssessment = await mlService.predict(data, 'risk');
        
        res.json({
            success: true,
            riskAssessment: riskAssessment
        });
    } catch (error) {
        logger.error('Risk assessment API error:', error);
        res.status(500).json({
            success: false,
            message: 'Risk assessment failed'
        });
    }
});

// Outbreak Prediction endpoint
router.post('/outbreak-prediction', async (req, res) => {
    try {
        const { features } = req.body;
        
        if (!features || !Array.isArray(features) || features.length !== 6) {
            return res.status(400).json({
                success: false,
                message: 'Features array with 6 elements is required: [currentCases, populationDensity, waterQuality, sanitation, temperature, humidity]'
            });
        }
        
        const prediction = await mlService.predict(features, 'outbreak');
        
        res.json({
            success: true,
            outbreakPrediction: prediction
        });
    } catch (error) {
        logger.error('Outbreak prediction API error:', error);
        res.status(500).json({
            success: false,
            message: 'Outbreak prediction failed'
        });
    }
});

// Clear API cache endpoint
router.post('/clear-cache', (req, res) => {
    try {
        apiService.clearCache();
        
        res.json({
            success: true,
            message: 'API cache cleared successfully'
        });
    } catch (error) {
        logger.error('Clear cache API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cache'
        });
    }
});

// API Health Check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SafeSip API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API Documentation endpoint
router.get('/docs', (req, res) => {
    const apiDocs = {
        endpoints: {
            'GET /api/realtime-data': 'Get aggregated real-time data for a location',
            'GET /api/weather/:location': 'Get weather data for a specific location',
            'GET /api/health/:state': 'Get health statistics for a state',
            'GET /api/water-quality/:region': 'Get water quality data for a region',
            'GET /api/disease-outbreaks/:region': 'Get disease outbreak information',
            'POST /api/predict': 'Get ML predictions (requires features array and modelType)',
            'POST /api/risk-assessment': 'Get risk assessment (requires data object)',
            'POST /api/outbreak-prediction': 'Predict disease outbreaks (requires features array)',
            'POST /api/clear-cache': 'Clear API data cache',
            'GET /api/health': 'API health check',
            'GET /api/docs': 'This documentation'
        },
        examples: {
            'Real-time data': '/api/realtime-data?location=Mumbai',
            'Weather': '/api/weather/Chennai',
            'Health data': '/api/health/Karnataka',
            'Water quality': '/api/water-quality/Punjab',
            'Disease prediction': {
                endpoint: '/api/predict',
                method: 'POST',
                body: {
                    features: [30, 75, 7.2, 45, 50000, 2, 25, 0.7],
                    modelType: 'disease'
                }
            },
            'Risk assessment': {
                endpoint: '/api/risk-assessment',
                method: 'POST',
                body: {
                    data: {
                        weather: {},
                        health: {},
                        waterQuality: {},
                        disease: {}
                    }
                }
            }
        }
    };
    
    res.json(apiDocs);
});

module.exports = router;
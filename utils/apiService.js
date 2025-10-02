const axios = require('axios');
const logger = require('./logger');
const aiApiService = require('./aiApiService');
const freeApiService = require('./freeApiService');

class APIService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = parseInt(process.env.CACHE_DURATION) || 300000; // 5 minutes
        this.aiService = aiApiService;
        this.freeService = freeApiService;
        
        // Use free APIs by default, fallback to AI if needed
        this.useFreeAPIs = process.env.USE_FREE_APIS !== 'false';
        logger.info(`API Service initialized - Free APIs: ${this.useFreeAPIs ? 'enabled' : 'disabled'}`);
    }

    // Generic API call with caching
    async makeAPICall(url, options = {}, cacheKey = null) {
        try {
            // Check cache first
            if (cacheKey && this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    return cached.data;
                }
            }

            const response = await axios({
                url,
                method: 'GET',
                timeout: 10000,
                ...options
            });

            const data = response.data;

            // Cache the result
            if (cacheKey) {
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
            }

            return data;
        } catch (error) {
            logger.error(`API call failed for ${url}:`, error.message);
            return null;
        }
    }

    // Weather API Integration - Free APIs First
    async getWeatherData(location = 'Delhi') {
        try {
            if (this.useFreeAPIs) {
                logger.info(`Getting FREE weather data for ${location}`);
                const data = await this.freeService.getFreeWeatherData(location);
                return data;
            } else {
                logger.info(`Getting AI-powered weather data for ${location}`);
                const data = await this.aiService.getWeatherData(location);
                return data;
            }
        } catch (error) {
            logger.error(`Weather API failed for ${location}:`, error.message);
            return this.getMockWeatherData(location);
        }
    }

    // Government Health Data - Free APIs First
    async getHealthData(state = 'Delhi') {
        try {
            if (this.useFreeAPIs) {
                logger.info(`Getting FREE health data for ${state}`);
                const data = await this.freeService.getFreeHealthData(state);
                return data;
            } else {
                logger.info(`Getting AI-powered health data for ${state}`);
                const data = await this.aiService.getHealthData(state);
                return data;
            }
        } catch (error) {
            logger.error(`Health API failed for ${state}:`, error.message);
            return this.getMockHealthData(state);
        }
    }

    // Water Quality Data - Free APIs First
    async getWaterQualityData(region = 'Delhi') {
        try {
            if (this.useFreeAPIs) {
                logger.info(`Getting FREE water quality data for ${region}`);
                const data = await this.freeService.getFreeWaterQualityData(region);
                return data;
            } else {
                logger.info(`Getting AI-powered water quality data for ${region}`);
                const data = await this.aiService.getWaterQualityData(region);
                return data;
            }
        } catch (error) {
            logger.error(`Water quality API failed for ${region}:`, error.message);
            return this.getMockWaterQualityData(region);
        }
    }

    // Disease Outbreak Data - Free APIs First
    async getDiseaseOutbreakData(region = 'Delhi') {
        try {
            if (this.useFreeAPIs) {
                logger.info(`Getting FREE disease outbreak data for ${region}`);
                const data = await this.freeService.getFreeDiseaseOutbreakData(region);
                return data;
            } else {
                logger.info(`Getting AI-powered disease outbreak data for ${region}`);
                const data = await this.aiService.getDiseaseOutbreakData(region);
                return data;
            }
        } catch (error) {
            logger.error(`Disease outbreak API failed for ${region}:`, error.message);
            return this.getMockDiseaseData(region);
        }
    }

    // Mock Data Functions (for development)
    getMockWeatherData(location) {
        const temps = [25, 28, 32, 29, 26, 30, 27];
        const humidity = [65, 70, 75, 68, 72, 69, 71];
        const random = Math.floor(Math.random() * temps.length);
        
        return {
            name: location,
            main: {
                temp: temps[random] + (Math.random() * 6 - 3), // ±3°C variation
                humidity: humidity[random] + (Math.random() * 10 - 5), // ±5% variation
                pressure: 1013 + (Math.random() * 20 - 10)
            },
            weather: [{
                main: Math.random() > 0.7 ? 'Rain' : 'Clear',
                description: Math.random() > 0.7 ? 'light rain' : 'clear sky'
            }],
            wind: {
                speed: Math.random() * 15 + 5 // 5-20 km/h
            }
        };
    }

    getMockHealthData(state) {
        const diseases = ['Cholera', 'Typhoid', 'Hepatitis A', 'Diarrhea', 'Dysentery'];
        const cases = Math.floor(Math.random() * 100) + 10;
        
        return {
            state,
            totalCases: cases,
            activeCases: Math.floor(cases * 0.7),
            recovered: Math.floor(cases * 0.25),
            deaths: Math.floor(cases * 0.05),
            diseases: diseases.map(disease => ({
                name: disease,
                cases: Math.floor(Math.random() * 30) + 5,
                trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
                riskLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
            })),
            lastUpdated: new Date().toISOString()
        };
    }

    getMockWaterQualityData(region) {
        const sources = ['River', 'Lake', 'Groundwater', 'Municipal'];
        const parameters = {
            pH: 6.5 + Math.random() * 2, // 6.5-8.5
            turbidity: Math.random() * 5, // 0-5 NTU
            coliform: Math.floor(Math.random() * 100), // 0-100 CFU/100ml
            chlorine: Math.random() * 2, // 0-2 mg/L
            fluoride: Math.random() * 1.5, // 0-1.5 mg/L
            arsenic: Math.random() * 0.05 // 0-0.05 mg/L
        };

        return {
            region,
            sources: sources.map(source => ({
                name: source,
                quality: Math.random() > 0.7 ? 'poor' : Math.random() > 0.3 ? 'good' : 'excellent',
                parameters: {
                    ...parameters,
                    pH: parameters.pH + (Math.random() * 0.4 - 0.2),
                    turbidity: Math.max(0, parameters.turbidity + (Math.random() * 2 - 1))
                },
                riskLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
            })),
            overallQuality: Math.random() > 0.7 ? 'poor' : Math.random() > 0.3 ? 'good' : 'excellent',
            lastTested: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        };
    }

    getMockDiseaseData(region) {
        const outbreaks = [
            'Waterborne Disease Cluster',
            'Cholera Outbreak',
            'Typhoid Cases',
            'Hepatitis A Spread',
            'Gastroenteritis Increase'
        ];

        return {
            region,
            activeOutbreaks: Math.floor(Math.random() * 3) + 1,
            outbreaks: outbreaks.slice(0, Math.floor(Math.random() * 3) + 1).map(outbreak => ({
                name: outbreak,
                cases: Math.floor(Math.random() * 50) + 10,
                affectedAreas: Math.floor(Math.random() * 5) + 1,
                severity: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
                startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                trend: Math.random() > 0.5 ? 'increasing' : 'decreasing'
            })),
            riskAssessment: {
                overall: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
                factors: [
                    'Water contamination',
                    'Poor sanitation',
                    'Population density',
                    'Seasonal patterns'
                ]
            },
            lastUpdated: new Date().toISOString()
        };
    }

    // Real-time Data Aggregator - Free APIs First
    async getAggregatedData(location = 'Delhi') {
        try {
            if (this.useFreeAPIs) {
                logger.info(`Getting FREE aggregated data for ${location}`);
                const data = await this.freeService.getFreeAggregatedData(location);
                return data;
            } else {
                logger.info(`Getting AI-powered aggregated data for ${location}`);
                const data = await this.aiService.getAggregatedData(location);
                return data;
            }
        } catch (error) {
            logger.error('Error getting aggregated data:', error);
            // Fallback to individual calls
            try {
                const [weather, health, waterQuality, disease] = await Promise.all([
                    this.getWeatherData(location),
                    this.getHealthData(location),
                    this.getWaterQualityData(location),
                    this.getDiseaseOutbreakData(location)
                ]);

                return {
                    location,
                    timestamp: new Date().toISOString(),
                    weather,
                    health,
                    waterQuality,
                    diseaseOutbreaks: disease,
                    summary: {
                        overallStatus: 'medium',
                        riskScore: this.calculateRiskScore({ weather, health, waterQuality, disease }),
                        activeCases: health.activeCases || 0,
                        waterQualityStatus: waterQuality.overallQuality || 'good',
                        activeOutbreaks: disease.activeOutbreaks || 0
                    },
                    dataSource: 'Fallback aggregation'
                };
            } catch (fallbackError) {
                logger.error('Fallback aggregation also failed:', fallbackError);
                return this.freeService.getMockAggregatedData(location);
            }
        }
    }

    // Calculate overall risk score
    calculateRiskScore(data) {
        let score = 0;
        let factors = 0;

        // Weather factors
        if (data.weather) {
            if (data.weather.weather[0].main === 'Rain') score += 2;
            if (data.weather.main.humidity > 80) score += 2;
            factors += 2;
        }

        // Health factors
        if (data.health) {
            const activeCases = data.health.activeCases || 0;
            if (activeCases > 50) score += 3;
            else if (activeCases > 20) score += 2;
            else if (activeCases > 5) score += 1;
            factors += 1;
        }

        // Water quality factors
        if (data.waterQuality) {
            const overallQuality = data.waterQuality.overallQuality;
            if (overallQuality === 'poor') score += 3;
            else if (overallQuality === 'good') score += 1;
            factors += 1;
        }

        // Disease outbreak factors
        if (data.disease) {
            const activeOutbreaks = data.disease.activeOutbreaks || 0;
            score += activeOutbreaks * 2;
            factors += 1;
        }

        const normalizedScore = factors > 0 ? (score / (factors * 3)) * 100 : 0;
        
        return {
            score: Math.min(100, Math.max(0, normalizedScore)),
            level: normalizedScore > 70 ? 'high' : normalizedScore > 40 ? 'medium' : 'low',
            factors: factors
        };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        logger.info('API cache cleared');
    }
}

module.exports = new APIService();
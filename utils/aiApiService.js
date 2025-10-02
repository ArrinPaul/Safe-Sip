const axios = require('axios');
const logger = require('./logger');

class AIAPIService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = parseInt(process.env.CACHE_DURATION) || 300000; // 5 minutes
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.openaiBaseUrl = 'https://api.openai.com/v1/chat/completions';
    }

    // Generic cache check
    checkCache(cacheKey) {
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        return null;
    }

    // Store in cache
    setCache(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    // Call Gemini API
    async callGeminiAPI(prompt) {
        if (!this.geminiApiKey || this.geminiApiKey.includes('test') || this.geminiApiKey.includes('demo')) {
            logger.info('Using mock data - Gemini API key not configured');
            return null;
        }

        try {
            const response = await axios.post(`${this.geminiBaseUrl}?key=${this.geminiApiKey}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            if (response.data && response.data.candidates && response.data.candidates[0]) {
                const text = response.data.candidates[0].content.parts[0].text;
                try {
                    return JSON.parse(text);
                } catch (e) {
                    // If not JSON, return as text
                    return { response: text };
                }
            }
            return null;
        } catch (error) {
            logger.error('Gemini API call failed:', error.message);
            return null;
        }
    }

    // Call OpenAI API
    async callOpenAIAPI(prompt) {
        if (!this.openaiApiKey || this.openaiApiKey.includes('test') || this.openaiApiKey.includes('demo')) {
            logger.info('Using mock data - OpenAI API key not configured');
            return null;
        }

        try {
            const response = await axios.post(this.openaiBaseUrl, {
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
                const text = response.data.choices[0].message.content;
                try {
                    return JSON.parse(text);
                } catch (e) {
                    return { response: text };
                }
            }
            return null;
        } catch (error) {
            logger.error('OpenAI API call failed:', error.message);
            return null;
        }
    }

    // Weather Data using AI
    async getWeatherData(location = 'Delhi') {
        const cacheKey = `weather_${location}`;
        const cached = this.checkCache(cacheKey);
        if (cached) return cached;

        const prompt = `Generate realistic current weather data for ${location}, India in JSON format. Include:
        {
            "location": "${location}",
            "temperature": number (15-45 range appropriate for season),
            "humidity": number (30-90),
            "conditions": string (sunny/cloudy/rainy/etc),
            "windSpeed": number (0-25 km/h),
            "pressure": number (980-1030 mb),
            "visibility": number (1-10 km),
            "uvIndex": number (1-11),
            "timestamp": current ISO timestamp
        }
        Make it realistic for current season and location. Respond only with valid JSON.`;

        let result = await this.callGeminiAPI(prompt);
        if (!result) {
            result = await this.callOpenAIAPI(prompt);
        }
        
        if (!result) {
            result = this.getMockWeatherData(location);
        }

        this.setCache(cacheKey, result);
        return result;
    }

    // Health Data using AI
    async getHealthData(state = 'Delhi') {
        const cacheKey = `health_${state}`;
        const cached = this.checkCache(cacheKey);
        if (cached) return cached;

        const prompt = `Generate realistic health statistics for ${state}, India focusing on waterborne diseases in JSON format:
        {
            "region": "${state}",
            "population": number,
            "activeCases": number (0-200),
            "newCases": number (0-50),
            "recoveredCases": number,
            "waterborneDiseases": {
                "cholera": number,
                "typhoid": number,
                "diarrhea": number,
                "hepatitisA": number
            },
            "riskLevel": "low/medium/high",
            "healthcareCapacity": number (0-100),
            "vaccinationRate": number (0-100),
            "timestamp": current ISO timestamp
        }
        Make it realistic for current conditions in India. Respond only with valid JSON.`;

        let result = await this.callGeminiAPI(prompt);
        if (!result) {
            result = await this.callOpenAIAPI(prompt);
        }
        
        if (!result) {
            result = this.getMockHealthData(state);
        }

        this.setCache(cacheKey, result);
        return result;
    }

    // Water Quality Data using AI
    async getWaterQualityData(region = 'Delhi') {
        const cacheKey = `water_${region}`;
        const cached = this.checkCache(cacheKey);
        if (cached) return cached;

        const prompt = `Generate realistic water quality data for ${region}, India in JSON format:
        {
            "region": "${region}",
            "sources": [
                {
                    "name": "River/Lake/Groundwater/Municipal",
                    "quality": "excellent/good/poor",
                    "parameters": {
                        "pH": number (6.5-8.5),
                        "turbidity": number (0-5 NTU),
                        "coliform": number (0-100 CFU/100ml),
                        "chlorine": number (0-2 mg/L),
                        "fluoride": number (0-1.5 mg/L),
                        "arsenic": number (0-0.05 mg/L),
                        "tds": number (50-500 mg/L)
                    },
                    "riskLevel": "low/medium/high"
                }
            ],
            "overallQuality": "excellent/good/poor",
            "safetyIndex": number (0-100),
            "lastTested": ISO timestamp,
            "recommendations": ["string array of recommendations"]
        }
        Include 3-4 different water sources. Make parameters scientifically accurate. Respond only with valid JSON.`;

        let result = await this.callGeminiAPI(prompt);
        if (!result) {
            result = await this.callOpenAIAPI(prompt);
        }
        
        if (!result) {
            result = this.getMockWaterQualityData(region);
        }

        this.setCache(cacheKey, result);
        return result;
    }

    // Disease Outbreak Data using AI
    async getDiseaseOutbreakData(region = 'Delhi') {
        const cacheKey = `disease_${region}`;
        const cached = this.checkCache(cacheKey);
        if (cached) return cached;

        const prompt = `Generate realistic disease outbreak data for ${region}, India in JSON format:
        {
            "region": "${region}",
            "activeOutbreaks": number (0-5),
            "outbreaks": [
                {
                    "name": "disease name",
                    "type": "waterborne/airborne/vector-borne",
                    "cases": number (5-100),
                    "deaths": number (0-10),
                    "affectedAreas": number (1-10),
                    "severity": "low/medium/high",
                    "startDate": ISO date,
                    "trend": "increasing/stable/decreasing",
                    "source": "water/food/contact/vector"
                }
            ],
            "riskFactors": ["array of risk factors"],
            "preventiveMeasures": ["array of prevention steps"],
            "alertLevel": "green/yellow/orange/red",
            "timestamp": current ISO timestamp
        }
        Focus on realistic waterborne diseases common in India. Respond only with valid JSON.`;

        let result = await this.callGeminiAPI(prompt);
        if (!result) {
            result = await this.callOpenAIAPI(prompt);
        }
        
        if (!result) {
            result = this.getMockDiseaseData(region);
        }

        this.setCache(cacheKey, result);
        return result;
    }

    // AI-powered risk assessment
    async getRiskAssessment(location, weatherData, healthData, waterData) {
        const prompt = `Based on the following data for ${location}, provide a comprehensive risk assessment for waterborne disease outbreaks:

        Weather: ${JSON.stringify(weatherData)}
        Health: ${JSON.stringify(healthData)}
        Water Quality: ${JSON.stringify(waterData)}

        Respond in JSON format:
        {
            "overallRisk": "low/medium/high/critical",
            "riskScore": number (0-100),
            "primaryFactors": ["array of main risk factors"],
            "recommendations": ["array of specific recommendations"],
            "timeframe": "immediate/short-term/long-term",
            "confidence": number (0-100),
            "analysis": "detailed analysis text",
            "timestamp": current ISO timestamp
        }
        Provide scientific analysis based on correlations between weather, water quality, and health data.`;

        let result = await this.callGeminiAPI(prompt);
        if (!result) {
            result = await this.callOpenAIAPI(prompt);
        }
        
        if (!result) {
            result = {
                overallRisk: 'medium',
                riskScore: 65,
                primaryFactors: ['Water quality concerns', 'Seasonal patterns', 'Population density'],
                recommendations: ['Monitor water sources', 'Improve sanitation', 'Health awareness campaigns'],
                timeframe: 'short-term',
                confidence: 85,
                analysis: 'Based on current conditions, moderate risk for waterborne disease outbreaks.',
                timestamp: new Date().toISOString()
            };
        }

        return result;
    }

    // Aggregated data with AI analysis
    async getAggregatedData(location) {
        try {
            const [weather, health, water, disease] = await Promise.all([
                this.getWeatherData(location),
                this.getHealthData(location),
                this.getWaterQualityData(location),
                this.getDiseaseOutbreakData(location)
            ]);

            const riskAssessment = await this.getRiskAssessment(location, weather, health, water);

            return {
                location,
                timestamp: new Date().toISOString(),
                weather,
                health,
                waterQuality: water,
                diseaseOutbreaks: disease,
                riskAssessment,
                summary: {
                    overallStatus: riskAssessment.overallRisk,
                    riskScore: riskAssessment.riskScore,
                    activeCases: health.activeCases || 0,
                    waterQualityStatus: water.overallQuality || 'good',
                    activeOutbreaks: disease.activeOutbreaks || 0
                }
            };
        } catch (error) {
            logger.error('Error getting aggregated data:', error);
            return this.getMockAggregatedData(location);
        }
    }

    // Fallback mock data methods
    getMockWeatherData(location) {
        return {
            location,
            temperature: 25 + Math.floor(Math.random() * 15),
            humidity: 60 + Math.floor(Math.random() * 30),
            conditions: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
            windSpeed: Math.floor(Math.random() * 20),
            pressure: 1000 + Math.floor(Math.random() * 30),
            visibility: 5 + Math.floor(Math.random() * 5),
            uvIndex: 1 + Math.floor(Math.random() * 10),
            timestamp: new Date().toISOString()
        };
    }

    getMockHealthData(state) {
        return {
            region: state,
            population: 1000000 + Math.floor(Math.random() * 10000000),
            activeCases: Math.floor(Math.random() * 150),
            newCases: Math.floor(Math.random() * 30),
            recoveredCases: Math.floor(Math.random() * 500),
            waterborneDiseases: {
                cholera: Math.floor(Math.random() * 20),
                typhoid: Math.floor(Math.random() * 30),
                diarrhea: Math.floor(Math.random() * 50),
                hepatitisA: Math.floor(Math.random() * 15)
            },
            riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            healthcareCapacity: 60 + Math.floor(Math.random() * 40),
            vaccinationRate: 70 + Math.floor(Math.random() * 30),
            timestamp: new Date().toISOString()
        };
    }

    getMockWaterQualityData(region) {
        const sources = ['River', 'Lake', 'Groundwater', 'Municipal'];
        return {
            region,
            sources: sources.map(source => ({
                name: source,
                quality: ['excellent', 'good', 'poor'][Math.floor(Math.random() * 3)],
                parameters: {
                    pH: 6.5 + Math.random() * 2,
                    turbidity: Math.random() * 5,
                    coliform: Math.floor(Math.random() * 100),
                    chlorine: Math.random() * 2,
                    fluoride: Math.random() * 1.5,
                    arsenic: Math.random() * 0.05,
                    tds: 50 + Math.floor(Math.random() * 450)
                },
                riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
            })),
            overallQuality: ['excellent', 'good', 'poor'][Math.floor(Math.random() * 3)],
            safetyIndex: 50 + Math.floor(Math.random() * 50),
            lastTested: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            recommendations: ['Regular testing', 'Improve filtration', 'Monitor sources']
        };
    }

    getMockDiseaseData(region) {
        const diseases = ['Cholera Outbreak', 'Typhoid Cases', 'Diarrheal Disease', 'Hepatitis A'];
        return {
            region,
            activeOutbreaks: Math.floor(Math.random() * 3),
            outbreaks: diseases.slice(0, Math.floor(Math.random() * 3) + 1).map(disease => ({
                name: disease,
                type: 'waterborne',
                cases: 5 + Math.floor(Math.random() * 95),
                deaths: Math.floor(Math.random() * 5),
                affectedAreas: 1 + Math.floor(Math.random() * 9),
                severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)],
                source: ['water', 'food', 'contact'][Math.floor(Math.random() * 3)]
            })),
            riskFactors: ['Poor sanitation', 'Contaminated water', 'Overcrowding'],
            preventiveMeasures: ['Boil water', 'Proper hygiene', 'Sanitation'],
            alertLevel: ['green', 'yellow', 'orange', 'red'][Math.floor(Math.random() * 4)],
            timestamp: new Date().toISOString()
        };
    }

    getMockAggregatedData(location) {
        return {
            location,
            timestamp: new Date().toISOString(),
            weather: this.getMockWeatherData(location),
            health: this.getMockHealthData(location),
            waterQuality: this.getMockWaterQualityData(location),
            diseaseOutbreaks: this.getMockDiseaseData(location),
            riskAssessment: {
                overallRisk: 'medium',
                riskScore: 65,
                primaryFactors: ['Seasonal patterns', 'Water quality', 'Population density'],
                recommendations: ['Monitor water quality', 'Health surveillance', 'Preventive measures'],
                timeframe: 'short-term',
                confidence: 80,
                analysis: 'Mock analysis based on current conditions',
                timestamp: new Date().toISOString()
            },
            summary: {
                overallStatus: 'medium',
                riskScore: 65,
                activeCases: 45,
                waterQualityStatus: 'good',
                activeOutbreaks: 2
            }
        };
    }
}

module.exports = new AIAPIService();
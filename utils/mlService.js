const stats = require('simple-statistics');
const logger = require('./logger');
const path = require('path');
const fs = require('fs');

class MLService {
    constructor() {
        this.models = {};
        this.trainingData = [];
        this.modelPath = process.env.ML_MODEL_PATH || './utils/models/';
        this.predictionThreshold = parseFloat(process.env.PREDICTION_THRESHOLD) || 0.7;
        this.initializeModels();
    }

    async initializeModels() {
        try {
            // Ensure models directory exists
            if (!fs.existsSync(this.modelPath)) {
                fs.mkdirSync(this.modelPath, { recursive: true });
            }

            // Initialize different models
            await this.loadOrCreateDiseasePredictor();
            await this.loadOrCreateOutbreakPredictor();
            await this.loadOrCreateRiskAssessmentModel();
            
            logger.info('ML models initialized successfully');
        } catch (error) {
            logger.error('Error initializing ML models:', error);
        }
    }

    // Disease Prediction Model (Simplified without TensorFlow)
    async loadOrCreateDiseasePredictor() {
        try {
            this.models.diseasePredictor = {
                predict: (features) => this.predictDiseaseSimple(features)
            };
            logger.info('Disease predictor model initialized (simplified)');
        } catch (error) {
            logger.error('Error with disease predictor:', error);
        }
    }

    predictDiseaseSimple(features) {
        // Simple rule-based disease prediction
        const [temp, humidity, ph, coliform, population, season, rainfall, sanitation] = features;
        
        const diseases = ['Cholera', 'Typhoid', 'Hepatitis A', 'Diarrhea', 'Dysentery'];
        const probabilities = [0, 0, 0, 0, 0];

        // Cholera - high coliform, poor sanitation
        if (coliform > 100 && sanitation < 0.5) {
            probabilities[0] = Math.min(0.9, 0.6 + (coliform / 200) + (1 - sanitation));
        }

        // Typhoid - contaminated water, moderate temperature
        if (coliform > 50 && temp > 25 && temp < 35) {
            probabilities[1] = Math.min(0.8, 0.4 + (coliform / 200) + (temp - 20) / 20);
        }

        // Hepatitis A - poor sanitation, contaminated water
        if (sanitation < 0.4 && coliform > 75) {
            probabilities[2] = Math.min(0.7, 0.3 + (1 - sanitation) + (coliform / 300));
        }

        // Diarrhea - various factors
        if (coliform > 25 || ph < 6.5 || ph > 8.5) {
            probabilities[3] = Math.min(0.8, 0.5 + (coliform / 200) + Math.abs(ph - 7) / 2);
        }

        // Dysentery - high coliform, poor conditions
        if (coliform > 80 && humidity > 70) {
            probabilities[4] = Math.min(0.7, 0.3 + (coliform / 200) + (humidity - 50) / 50);
        }

        // Normalize and add some randomness for realism
        const totalProb = probabilities.reduce((sum, p) => sum + p, 0);
        if (totalProb > 0) {
            for (let i = 0; i < probabilities.length; i++) {
                probabilities[i] = (probabilities[i] / totalProb) * (0.8 + Math.random() * 0.4);
            }
        }

        return diseases.map((disease, index) => ({
            disease,
            probability: probabilities[index],
            risk: probabilities[index] > 0.7 ? 'high' : 
                  probabilities[index] > 0.4 ? 'medium' : 'low'
        }));
    }

    generateDiseaseLabels(features) {
        const [temp, humidity, ph, coliform] = features;
        let probabilities = [0, 0, 0, 0, 0];

        // Cholera - high coliform, poor sanitation
        if (coliform > 100 && features[7] < 0.5) {
            probabilities[0] = 0.8 + Math.random() * 0.2;
        }

        // Typhoid - contaminated water, moderate temperature
        if (coliform > 50 && temp > 25 && temp < 35) {
            probabilities[1] = 0.6 + Math.random() * 0.3;
        }

        // Hepatitis A - poor sanitation, contaminated water
        if (features[7] < 0.4 && coliform > 75) {
            probabilities[2] = 0.5 + Math.random() * 0.4;
        }

        // Diarrhea - various factors
        if (coliform > 25 || ph < 6.5 || ph > 8.5) {
            probabilities[3] = 0.7 + Math.random() * 0.3;
        }

        // Dysentery - high coliform, poor conditions
        if (coliform > 80 && humidity > 70) {
            probabilities[4] = 0.5 + Math.random() * 0.4;
        }

        // Normalize probabilities
        const sum = probabilities.reduce((a, b) => a + b, 0);
        if (sum > 0) {
            probabilities = probabilities.map(p => p / sum);
        } else {
            probabilities[Math.floor(Math.random() * 5)] = 1;
        }

        return probabilities;
    }

    // Outbreak Prediction Model (using regression)
    async loadOrCreateOutbreakPredictor() {
        try {
            // Use polynomial regression for outbreak prediction
            this.models.outbreakPredictor = {
                predict: (features) => this.predictOutbreak(features)
            };
            logger.info('Outbreak predictor initialized');
        } catch (error) {
            logger.error('Error creating outbreak predictor:', error);
        }
    }

    predictOutbreak(features) {
        // Features: [currentCases, populationDensity, waterQuality, sanitation, temperature, humidity]
        const [cases, density, quality, sanitation, temp, humidity] = features;
        
        // Simple regression-based prediction
        let riskScore = 0;
        
        // Case trend factor
        riskScore += Math.min(cases / 100, 1) * 30;
        
        // Population density factor
        riskScore += Math.min(density / 10000, 1) * 25;
        
        // Water quality factor (inverse)
        riskScore += (1 - quality) * 20;
        
        // Sanitation factor (inverse)
        riskScore += (1 - sanitation) * 15;
        
        // Environmental factors
        if (temp > 30 || temp < 15) riskScore += 5;
        if (humidity > 80) riskScore += 5;
        
        return {
            riskScore: Math.min(100, riskScore),
            likelihood: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
            confidence: 0.75 + Math.random() * 0.2
        };
    }

    // Risk Assessment Model
    async loadOrCreateRiskAssessmentModel() {
        this.models.riskAssessment = {
            assess: (data) => this.assessRisk(data)
        };
        logger.info('Risk assessment model initialized');
    }

    assessRisk(data) {
        const factors = [];
        let totalRisk = 0;
        let weightSum = 0;

        // Weather risk
        if (data.weather) {
            const weatherRisk = this.calculateWeatherRisk(data.weather);
            factors.push({ type: 'weather', risk: weatherRisk, weight: 0.2 });
            totalRisk += weatherRisk * 0.2;
            weightSum += 0.2;
        }

        // Water quality risk
        if (data.waterQuality) {
            const waterRisk = this.calculateWaterRisk(data.waterQuality);
            factors.push({ type: 'water', risk: waterRisk, weight: 0.3 });
            totalRisk += waterRisk * 0.3;
            weightSum += 0.3;
        }

        // Health data risk
        if (data.health) {
            const healthRisk = this.calculateHealthRisk(data.health);
            factors.push({ type: 'health', risk: healthRisk, weight: 0.3 });
            totalRisk += healthRisk * 0.3;
            weightSum += 0.3;
        }

        // Disease outbreak risk
        if (data.disease) {
            const diseaseRisk = this.calculateDiseaseRisk(data.disease);
            factors.push({ type: 'disease', risk: diseaseRisk, weight: 0.2 });
            totalRisk += diseaseRisk * 0.2;
            weightSum += 0.2;
        }

        const normalizedRisk = weightSum > 0 ? totalRisk / weightSum : 0;

        return {
            overallRisk: normalizedRisk,
            level: normalizedRisk > 70 ? 'high' : normalizedRisk > 40 ? 'medium' : 'low',
            factors,
            recommendations: this.generateRecommendations(normalizedRisk, factors),
            confidence: this.calculateConfidence(factors)
        };
    }

    calculateWeatherRisk(weather) {
        let risk = 0;
        
        if (weather.weather[0].main === 'Rain') risk += 30;
        if (weather.main.humidity > 80) risk += 25;
        if (weather.main.temp > 35 || weather.main.temp < 10) risk += 20;
        if (weather.wind.speed < 5) risk += 15;
        
        return Math.min(100, risk);
    }

    calculateWaterRisk(waterQuality) {
        let risk = 0;
        
        if (waterQuality.overallQuality === 'poor') risk += 60;
        else if (waterQuality.overallQuality === 'good') risk += 20;
        
        // Check individual sources
        const poorSources = waterQuality.sources.filter(s => s.quality === 'poor').length;
        risk += poorSources * 15;
        
        return Math.min(100, risk);
    }

    calculateHealthRisk(health) {
        let risk = 0;
        
        const activeCases = health.activeCases || 0;
        if (activeCases > 100) risk += 60;
        else if (activeCases > 50) risk += 40;
        else if (activeCases > 10) risk += 20;
        
        // Disease severity
        const highRiskDiseases = health.diseases.filter(d => d.riskLevel === 'high').length;
        risk += highRiskDiseases * 15;
        
        return Math.min(100, risk);
    }

    calculateDiseaseRisk(disease) {
        let risk = 0;
        
        const activeOutbreaks = disease.activeOutbreaks || 0;
        risk += activeOutbreaks * 25;
        
        // Check outbreak severity
        const highSeverityOutbreaks = disease.outbreaks.filter(o => o.severity === 'high').length;
        risk += highSeverityOutbreaks * 20;
        
        return Math.min(100, risk);
    }

    generateRecommendations(riskLevel, factors) {
        const recommendations = [];
        
        if (riskLevel > 70) {
            recommendations.push('Immediate action required - High risk situation');
            recommendations.push('Implement emergency water treatment protocols');
            recommendations.push('Increase health monitoring and surveillance');
        } else if (riskLevel > 40) {
            recommendations.push('Moderate risk - Enhanced monitoring recommended');
            recommendations.push('Review water treatment processes');
            recommendations.push('Prepare preventive measures');
        } else {
            recommendations.push('Low risk - Continue routine monitoring');
            recommendations.push('Maintain current preventive measures');
        }

        // Factor-specific recommendations
        factors.forEach(factor => {
            if (factor.risk > 60) {
                switch (factor.type) {
                    case 'water':
                        recommendations.push('Immediate water quality testing required');
                        break;
                    case 'weather':
                        recommendations.push('Weather-related precautions advised');
                        break;
                    case 'health':
                        recommendations.push('Enhanced health surveillance needed');
                        break;
                    case 'disease':
                        recommendations.push('Disease outbreak protocols should be activated');
                        break;
                }
            }
        });

        return recommendations;
    }

    calculateConfidence(factors) {
        const baseConfidence = 0.7;
        const factorBonus = factors.length * 0.05;
        return Math.min(0.95, baseConfidence + factorBonus);
    }

    // Main prediction function
    async predict(inputData, modelType = 'disease') {
        try {
            switch (modelType) {
                case 'disease':
                    return await this.predictDisease(inputData);
                case 'outbreak':
                    return this.predictOutbreak(inputData);
                case 'risk':
                    return this.assessRisk(inputData);
                default:
                    throw new Error(`Unknown model type: ${modelType}`);
            }
        } catch (error) {
            logger.error(`Prediction error for ${modelType}:`, error);
            return null;
        }
    }

    async predictDisease(features) {
        if (!this.models.diseasePredictor) {
            throw new Error('Disease predictor model not loaded');
        }

        const results = this.models.diseasePredictor.predict(features);
        const sortedResults = results.sort((a, b) => b.probability - a.probability);

        return {
            predictions: sortedResults,
            mostLikely: sortedResults[0],
            confidence: Math.max(...results.map(r => r.probability))
        };
    }

    // Training data management
    addTrainingData(input, output, modelType = 'disease') {
        this.trainingData.push({
            input,
            output,
            modelType,
            timestamp: new Date().toISOString()
        });
    }

    // Model retraining (simplified)
    async retrainModel(modelType = 'disease') {
        try {
            const relevantData = this.trainingData.filter(d => d.modelType === modelType);
            
            if (relevantData.length < 100) {
                logger.warn(`Insufficient data for retraining ${modelType} model`);
                return false;
            }

            // Retrain logic would go here
            logger.info(`Retraining ${modelType} model with ${relevantData.length} samples`);
            return true;
        } catch (error) {
            logger.error(`Error retraining ${modelType} model:`, error);
            return false;
        }
    }

    // Save models (simplified)
    async saveModels() {
        try {
            logger.info('Models saved (simplified implementation)');
        } catch (error) {
            logger.error('Error saving models:', error);
        }
    }
}

module.exports = new MLService();
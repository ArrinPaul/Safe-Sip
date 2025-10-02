import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [villages, setVillages] = useState([]);
  const [cases, setCases] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    initializeSocket();
    fetchInitialData();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeSocket = () => {
    const newSocket = io(API_BASE_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to SafeSip real-time system');
    });

    newSocket.on('realtime-update', (data) => {
      setRealTimeData(data);
    });

    newSocket.on('new-case', (newCase) => {
      setCases(prev => [newCase, ...prev]);
    });

    newSocket.on('case-update', (updatedCase) => {
      setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from SafeSip real-time system');
    });

    setSocket(newSocket);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [villagesRes, casesRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/villages`),
        axios.get(`${API_BASE_URL}/api/cases`),
        axios.get(`${API_BASE_URL}/api/analytics`)
      ]);

      setVillages(villagesRes.data);
      setCases(casesRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async (location = 'Delhi') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/realtime-data?location=${location}`);
      setRealTimeData(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
      throw error;
    }
  };

  const fetchWeatherData = async (location) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/weather/${location}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error;
    }
  };

  const fetchHealthData = async (state) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health/${state}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      throw error;
    }
  };

  const submitPrediction = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to submit prediction:', error);
      throw error;
    }
  };

  const createCase = async (caseData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/cases`, caseData);
      setCases(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Failed to create case:', error);
      throw error;
    }
  };

  const updateCase = async (caseId, updates) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/cases/${caseId}`, updates);
      setCases(prev => prev.map(c => c.id === caseId ? response.data : c));
      return response.data;
    } catch (error) {
      console.error('Failed to update case:', error);
      throw error;
    }
  };

  const getFilteredCases = (filters = {}) => {
    let filtered = cases;

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.village) {
      filtered = filtered.filter(c => c.village === filters.village);
    }

    if (filters.disease) {
      filtered = filtered.filter(c => c.disease === filters.disease);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(c => {
        const caseDate = new Date(c.date);
        return caseDate >= start && caseDate <= end;
      });
    }

    return filtered;
  };

  const getVillageStats = () => {
    return {
      total: villages.length,
      highRisk: villages.filter(v => v.riskLevel === 'high').length,
      mediumRisk: villages.filter(v => v.riskLevel === 'medium').length,
      lowRisk: villages.filter(v => v.riskLevel === 'low').length,
      totalPopulation: villages.reduce((sum, v) => sum + v.population, 0),
      totalActiveCases: villages.reduce((sum, v) => sum + v.activeCases, 0)
    };
  };

  const getCaseStats = () => {
    return {
      total: cases.length,
      active: cases.filter(c => c.status === 'active').length,
      contained: cases.filter(c => c.status === 'contained').length,
      monitoring: cases.filter(c => c.status === 'monitoring').length,
      resolved: cases.filter(c => c.status === 'resolved').length
    };
  };

  const value = {
    // Data
    realTimeData,
    villages,
    cases,
    analytics,
    loading,
    error,
    socket,
    
    // Functions
    fetchRealTimeData,
    fetchWeatherData,
    fetchHealthData,
    submitPrediction,
    createCase,
    updateCase,
    getFilteredCases,
    
    // Stats
    villageStats: getVillageStats(),
    caseStats: getCaseStats(),
    
    // Refresh
    refreshData: fetchInitialData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import pages
import HomePage from './pages/HomePage';
import LandingEventPage from './pages/LandingEventPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ASHADashboard from './pages/ASHADashboard';
import PHCDashboard from './pages/PHCDashboard';
import HealthDashboard from './pages/HealthDashboard';
import WorkflowPage from './pages/WorkflowPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import NotFoundPage from './pages/NotFoundPage';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Import context
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <Navbar />
          
          <main className="relative">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/new" element={<LandingEventPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/asha-dashboard" element={<ASHADashboard />} />
                <Route path="/phc-dashboard" element={<PHCDashboard />} />
                <Route path="/health-dashboard" element={<HealthDashboard />} />
                <Route path="/workflow" element={<WorkflowPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/DashBoard';
import ResumeBuilder from './pages/ResumeBuilder';
import CareerProfile from './pages/CareerProfile';
import CoverLetter from './pages/CoverLetter';
import Opportunity from './pages/Opportunity';
import History from './pages/History';
import Settings from './pages/Settings';
import ATS from './pages/ATS'; // ✅ Import the ATS page

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-builder"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-profile"
            element={
              <ProtectedRoute>
                <CareerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cover-letter"
            element={
              <ProtectedRoute>
                <CoverLetter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <Opportunity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ats"
            element={
              <ProtectedRoute>
                <ATS />
              </ProtectedRoute>
            }
          /> {/* ✅ ATS route added here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

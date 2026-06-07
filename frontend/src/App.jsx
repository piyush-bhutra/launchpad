import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Opportunities from './pages/Opportunities.jsx';
import Deadlines from './pages/Deadlines.jsx';
import ResumeManager from './pages/ResumeManager.jsx';
import CareerIntelligence from './pages/CareerIntelligence.jsx';
import History from './pages/History.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <div className="h-screen w-screen bg-white">
        <LoadingSpinner fullscreen label="INITIALIZING LAUNCHPAD" />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
      <Route path="/deadlines" element={<ProtectedRoute><Deadlines /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumeManager /></ProtectedRoute>} />
      <Route path="/career-intelligence" element={<ProtectedRoute><CareerIntelligence /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
    </Routes>
  );
}

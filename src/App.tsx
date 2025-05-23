import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/store';

// Layouts
import AppLayout from './components/layout/app-layout';
import AuthLayout from './components/layout/auth-layout';
import ProtectedRoute from './components/auth/protected-route';

// Auth Pages
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';

// App Pages
import DashboardPage from './pages/dashboard';
import ChildrenPage from './pages/children/index';

const App: React.FC = () => {
  const { setLoading, isAuthenticated } = useAuthStore();
  
  // Check for existing auth session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // In a real app, we would check for a valid token in localStorage/cookies
        // and make an API call to validate it
        
        // For demo purposes, we'll simulate this check
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [setLoading]);
  
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<div>Forgot Password Page</div>} />
        </Route>
        
        {/* App Routes - Protected */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="children" element={<ChildrenPage />} />
          <Route path="children/new" element={<div>Add Child Page</div>} />
          <Route path="events" element={<div>Events Page</div>} />
          <Route path="campaigns" element={<div>Campaigns Page</div>} />
          <Route path="templates" element={<div>Email Templates Page</div>} />
          
          {/* Owner/Admin only routes */}
          <Route 
            path="coupons" 
            element={
              <ProtectedRoute requireRole="owner">
                <div>Coupons Page</div>
              </ProtectedRoute>
            } 
          />
          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route 
            path="api" 
            element={
              <ProtectedRoute requireRole="owner">
                <div>API Access Page</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute requireRole="owner">
                <div>Settings Page</div>
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 404 Catch All */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
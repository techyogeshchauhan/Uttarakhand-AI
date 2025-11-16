
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPageRedesigned from './components/LandingPageRedesigned';
import ServicesPage from './components/ServicesPage';
import Login from './components/Auth/Login';
import Profile from './components/Auth/Profile';
import Dashboard from './components/Dashboard';
import ChatHistory from './components/chat/ChatHistory';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageRedesigned />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/services" 
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <ChatHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/ui/AuthForm';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ui/ProtectedRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<AuthForm isSignup={false} />} />
      <Route path="/signup" element={<AuthForm isSignup={true} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
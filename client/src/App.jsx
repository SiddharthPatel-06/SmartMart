import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/ui/AuthForm";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NewDashboard from "./pages/NewDashboard";
import InventoryPage from "./pages/Inventory";
import Layout from "./components/Layout";
import Home from "./pages/Home";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthForm isSignup={false} />} />
      <Route path="/signup" element={<AuthForm isSignup={true} />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <NewDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <InventoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;

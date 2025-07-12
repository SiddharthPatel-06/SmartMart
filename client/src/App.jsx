import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/ui/AuthForm";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NewDashboard from "./pages/NewDashboard";
import InventoryPage from "./pages/Inventory";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import CreateOrder from "./pages/CreateOrder";
import DeliveryMap from "./pages/DeliveryMap";

const App = () => (
  <Router>
    <Toaster position="top-right" />
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
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Layout>
              <Billing />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-order"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateOrder />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery-map"
        element={
          <ProtectedRoute>
            <Layout>
              <DeliveryMap />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;

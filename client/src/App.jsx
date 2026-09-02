import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/customer/Home';
import StoreDetails from './pages/customer/StoreDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderTracking from './pages/customer/OrderTracking';
import StoreDashboard from './pages/store/StoreDashboard';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Import styles
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/store/:id" element={<StoreDetails />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

            {/* Store Routes */}
            <Route path="/store/dashboard" element={<ProtectedRoute requiredRole="store"><StoreDashboard /></ProtectedRoute>} />

            {/* Delivery Partner Routes */}
            <Route path="/delivery/dashboard" element={<ProtectedRoute requiredRole="delivery_partner"><DeliveryDashboard /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

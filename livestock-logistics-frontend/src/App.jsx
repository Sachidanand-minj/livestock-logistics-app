import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Helpers
import RoleRouter from './RoleRouter';
import Navbar from './components/Navbar';

// Optional: NotFound or Home
const NotFound = () => <div className="p-8 text-center text-red-600">404 - Page Not Found</div>;
const Home = () => <div className="p-8 text-center">Welcome to Livestock Logistics 🚚</div>;

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Unified Dashboard Route */}
        <Route path="/dashboard" element={<RoleRouter />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

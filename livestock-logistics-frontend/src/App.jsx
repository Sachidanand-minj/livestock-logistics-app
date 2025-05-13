import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgImage from './assets/Home.png';
import { NotificationProvider } from './context/NotificationContext';
import NotificationListener from './components/NotificationListener';


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

// ✨ Updated Home Component ✨
const Home = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-8 text-center"
      style={{ backgroundImage: `url(${bgImage})` }} // Notice the template string here
    >

      {/* Register Now Button */}
      <a
        href="/register"
        className="absolute bottom-8 left-5 bg-red-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition"
      >
        Register Now
      </a>
    </div>
  );
};


function App() {
  return (
    <NotificationProvider>
    <Router>
      <Navbar />
      <ToastContainer position="top-right" />
      <NotificationListener />

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
    </NotificationProvider>
    
  );
}

export default App;

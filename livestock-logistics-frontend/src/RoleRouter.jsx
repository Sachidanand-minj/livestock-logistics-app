import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import SenderDashboard from './pages/Dashboard/Sender/SenderDashboard';
import TransporterDashboard from './pages/Dashboard/Transporter/TransporterDashboard';
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';

const RoleRouter = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const name = localStorage.getItem('name');

    if (storedRole) {
      setRole(storedRole);
      if (name) {
        toast.success(`Welcome back, ${name} 👋`, { autoClose: 1500 });
      }
    }

    setTimeout(() => setLoading(false), 300); // fake delay for smoother UX
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-600 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  switch (role) {
    case 'sender':
    case 'receiver': // legacy users
      return <SenderDashboard />;
    case 'transporter':
      return <TransporterDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleRouter;

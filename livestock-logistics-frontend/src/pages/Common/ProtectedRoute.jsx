import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

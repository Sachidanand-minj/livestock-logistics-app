
// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const RoleRouter = () => {
//   const [loading, setLoading] = useState(true);
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem('userRole');
//     const name = localStorage.getItem('name');

//     const validRoles = ['sender', 'receiver', 'transporter', 'admin'];

//     if (storedRole && validRoles.includes(storedRole)) {
//       setRole(storedRole);
//       if (name) {
//         toast.success(`Welcome back, ${name} 👋`, { autoClose: 1500 });
//       }
//     } else {
//       // Clear corrupt or missing role
//       localStorage.removeItem('userRole');
//       setRole(null);
//     }

//     // Fake delay for smoother transition
//     setTimeout(() => setLoading(false), 300);
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-lg font-medium text-gray-600 animate-pulse">
//           Loading dashboard...
//         </div>
//       </div>
//     );
//   }

//   // Redirect based on role
//   switch (role) {
//     case 'sender':
//     case 'receiver': // legacy users
//       return <Navigate to="/dashboard?tab=create" replace />;
//     case 'transporter':
//       return <Navigate to="/transporter?tab=available" replace />;
//     case 'admin':
//       return <Navigate to="/admin?tab=users" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// export default RoleRouter;

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import SenderDashboard from './pages/Dashboard/Sender/SenderDashboard';
import TransporterDashboard from './pages/Dashboard/Transporter/TransporterDashboard';
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';

const RoleRouter = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const name = localStorage.getItem('name');

    if (storedRole) {
      setRole(storedRole);
      if (name) {
        toast.success(`Welcome back, ${name} 👋`, { autoClose: 1500 });
      }
    } else {
      navigate('/login');
    }

    setTimeout(() => setLoading(false), 200); // optional UX delay
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  switch (role) {
    case 'sender':
    case 'receiver': // legacy
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

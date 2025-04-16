import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
// import SenderDashboard from './pages/Dashboard/Sender/SenderDashboard';
// import TransporterDashboard from './pages/Dashboard/Transporter/TransporterDashboard';
// import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';
import Register from './pages/Auth/Register';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import RoleRouter from './RoleRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// const RoleRouter = () => {
//   const role = localStorage.getItem('userRole');
//   switch (role) {
//     case 'sender': return <SenderDashboard />;
//     case 'transporter': return <TransporterDashboard />;
//     case 'admin': return <AdminDashboard />;
//     default: return <Navigate to="/login" />;
//   }
// };

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><RoleRouter /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;

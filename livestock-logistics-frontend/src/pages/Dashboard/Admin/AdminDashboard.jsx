import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SummaryOverview from '../../../components/SummaryOverview';
import SidebarProfile from '../../Common/SidebarProfile';
import UserList from './UserList';
import AdminAddUser from './AdminAddUser';
import PendingUserApproval from './PendingUserApproval';
import ShipmentMonitor from './ShipmentMonitor';
import AdminTracking from './AdminTracking';
import UserProfile from '../../Common/UserProfile';
import PendingProofs from './PendingProofs';
import RejectedProofs from './RejectedProofs';

import {
  MdDashboard,
  MdGroup,
  MdPersonAdd,
  MdPending,
  MdLocalShipping,
  MdLocationOn,
  MdFactCheck,
  MdCancel,
  MdPerson,
  MdExitToApp,
} from 'react-icons/md';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'users';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('tab');
    if (q && q !== activeTab) {
      setActiveTab(q);
    }
  }, [location.search]);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('tab') !== activeTab) {
      p.set('tab', activeTab);
      navigate({ pathname: '/dashboard', search: p.toString() }, { replace: true });
    }
  }, [activeTab]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600">Admin Dashboard</h2>
        <button onClick={() => setShowSidebar(x => !x)} className="text-gray-600 text-2xl">☰</button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 h-full bg-white z-50 p-4 w-64 border-r border-t shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setShowSidebar(false)} className="text-gray-500">✕</button>
        </div>

        <SidebarProfile />

        <nav className="space-y-2 mt-6">
          <button title="Dashboard" onClick={() => { setActiveTab('overview'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'overview' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdDashboard size={20} /> Dashboard
          </button>
          <button title="User List" onClick={() => { setActiveTab('users'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'users' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdGroup size={20} /> User List
          </button>
          <button title="Create New User" onClick={() => { setActiveTab('createUser'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'createUser' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdPersonAdd size={20} /> Create User
          </button>
          <button title="Approve Pending Users" onClick={() => { setActiveTab('pending'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'pending' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdPending size={20} /> Pending Users
          </button>
          <button title="Monitor All Shipments" onClick={() => { setActiveTab('shipments'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'shipments' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdLocalShipping size={20} /> Shipment Monitor
          </button>
          <button title="Admin Tracking View" onClick={() => { setActiveTab('tracking'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'tracking' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdLocationOn size={20} /> Tracking
          </button>
          <button title="Pending Proof Verifications" onClick={() => { setActiveTab('proofs'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'proofs' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdFactCheck size={20} /> Pending Proofs
          </button>
          <button title="View Rejected Proofs" onClick={() => { setActiveTab('rejectedProofs'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'rejectedProofs' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdCancel size={20} /> Rejected Proofs
          </button>
          <button title="Edit Your Profile" onClick={() => { setActiveTab('profile'); setShowSidebar(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
            <MdPerson size={20} /> Edit Profile
          </button>
        </nav>

        <div className="mt-6 pt-4 border-t">
          <button title="Logout" onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded flex items-center gap-3">
            <MdExitToApp size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 mt-4 md:mt-0">
        {activeTab === 'overview' && <SummaryOverview role="admin" />}
        {activeTab === 'users' && <UserList />}
        {activeTab === 'createUser' && <AdminAddUser />}
        {activeTab === 'pending' && <PendingUserApproval />}
        {activeTab === 'shipments' && <ShipmentMonitor />}
        {activeTab === 'tracking' && <AdminTracking />}
        {activeTab === 'proofs' && <PendingProofs />}
        {activeTab === 'rejectedProofs' && <RejectedProofs />}
        {activeTab === 'profile' && <UserProfile />}
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around md:hidden shadow-md z-50">
        <button title="User List" onClick={() => setActiveTab('users')} className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'users' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdGroup size={20} /> Users
        </button>
        <button title="Shipments" onClick={() => setActiveTab('shipments')} className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'shipments' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdLocalShipping size={20} /> Shipments
        </button>
        <button title="Tracking" onClick={() => setActiveTab('tracking')} className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'tracking' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdLocationOn size={20} /> Tracking
        </button>
        <button title="Profile" onClick={() => setActiveTab('profile')} className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdPerson size={20} /> Profile
        </button>
        <button title="Logout" onClick={handleLogout} className="flex-1 text-sm py-1 text-red-500 flex flex-col items-center">
          <MdExitToApp size={20} /> Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SummaryOverview from '../../../components/SummaryOverview';
import CreateShipment from './CreateShipment';
import ViewShipments from './ViewShipments';
import UserProfile from '../../Common/UserProfile';
import SidebarProfile from '../../Common/SidebarProfile';
import SenderTracking from './SenderTracking';

import {
  MdDashboard,
  MdAddBox,
  MdListAlt,
  MdLocationOn,
  MdPerson,
  MdExitToApp,
} from 'react-icons/md';

const SenderDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab') || 'create';

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const queryTab = new URLSearchParams(location.search).get('tab');
    if (queryTab && queryTab !== activeTab) {
      setActiveTab(queryTab);
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== activeTab) {
      params.set('tab', activeTab);
      navigate({ pathname: '/dashboard', search: params.toString() }, { replace: true });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600">Sender Dashboard</h2>
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-gray-600 text-2xl">☰</button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:static top-0 border-t left-0 h-full bg-white z-50 transition-transform duration-300 ease-in-out border-r shadow-sm p-4 w-64 
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="md:hidden flex justify-end">
          <button onClick={() => setShowSidebar(false)} className="text-gray-500 mb-4">✕</button>
        </div>

        <SidebarProfile />

        <nav className="space-y-2 mt-6">
          <button title="Dashboard" onClick={() => { setActiveTab('overview'); setShowSidebar(false); }}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'overview' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}>
            <MdDashboard size={20} /> Dashboard
          </button>
          <button title="Create Shipment" onClick={() => { setActiveTab('create'); setShowSidebar(false); }}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'create' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}>
            <MdAddBox size={20} /> Create Shipment
          </button>
          <button title="View Shipments" onClick={() => { setActiveTab('view'); setShowSidebar(false); }}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'view' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}>
            <MdListAlt size={20} /> View Shipments
          </button>
          <button title="Track Shipments" onClick={() => { setActiveTab('tracking'); setShowSidebar(false); }}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'tracking' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}>
            <MdLocationOn size={20} /> Tracking
          </button>
          <button title="Edit Profile" onClick={() => { setActiveTab('profile'); setShowSidebar(false); }}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}>
            <MdPerson size={20} /> Edit Profile
          </button>
        </nav>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded flex items-center gap-3"
          >
            <MdExitToApp size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 mt-4 md:mt-0">
        {activeTab === 'overview' && <SummaryOverview role="sender" />}
        {activeTab === 'create' && <CreateShipment />}
        {activeTab === 'view' && <ViewShipments />}
        {activeTab === 'tracking' && <SenderTracking />}
        {activeTab === 'profile' && <UserProfile />}
      </main>

      {/* Bottom Navbar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around md:hidden shadow-md z-50">
        <button onClick={() => setActiveTab('create')} title="Create Shipment"
          className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'create' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdAddBox size={20} /> Create
        </button>
        <button onClick={() => setActiveTab('view')} title="View Shipments"
          className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'view' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdListAlt size={20} /> Shipments
        </button>
        <button onClick={() => setActiveTab('tracking')} title="Track Shipments"
          className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'tracking' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdLocationOn size={20} /> Tracking
        </button>
        <button onClick={() => setActiveTab('profile')} title="Profile"
          className={`flex-1 text-sm py-1 flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
          <MdPerson size={20} /> Profile
        </button>
        <button onClick={handleLogout} title="Logout"
          className="flex-1 text-sm text-red-500 py-1 flex flex-col items-center">
          <MdExitToApp size={20} /> Logout
        </button>
      </nav>
    </div>
  );
};

export default SenderDashboard;

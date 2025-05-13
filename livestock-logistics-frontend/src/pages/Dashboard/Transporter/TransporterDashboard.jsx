import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SummaryOverview from '../../../components/SummaryOverview';
import AvailableShipments from './AvailableShipments';
import MyShipments from './MyShipments';
import OngoingTracking from './OngoingTracking';
import UserProfile from '../../Common/UserProfile';
import SidebarProfile from '../../Common/SidebarProfile';

import {
  MdDashboard,
  MdLocalShipping,
  MdAssignment,
  MdLocationOn,
  MdPerson,
  MdExitToApp,
} from 'react-icons/md';

const TransporterDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const qp = new URLSearchParams(location.search);
  const initialTab = qp.get('tab') || 'available';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('tab');
    if (q && q !== activeTab) setActiveTab(q);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== activeTab) {
      params.set('tab', activeTab);
      navigate({ pathname: '/dashboard', search: params.toString() }, {
        replace: true
      });
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
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600">Transporter</h2>
        <button onClick={() => setShowSidebar(x => !x)} className="text-gray-600 text-2xl">☰</button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 h-full bg-white z-50
        transform transition-transform duration-300 ease-in-out
        border-r border-t shadow-sm p-4 w-64
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setShowSidebar(false)} className="text-gray-500">✕</button>
        </div>

        <SidebarProfile />

        <nav className="space-y-2 mt-6">
          <button
            title="Dashboard Overview"
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'overview' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('overview'); setShowSidebar(false); }}
          >
            <MdDashboard size={20} />
            Dashboard
          </button>
          <button
            title="View Available Shipments"
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'available' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('available'); setShowSidebar(false); }}
          >
            <MdLocalShipping size={20} />
            Available Shipments
          </button>
          <button
            title="Your Accepted Shipments"
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'myShipments' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('myShipments'); setShowSidebar(false); }}
          >
            <MdAssignment size={20} />
            My Shipments
          </button>
          <button
            title="Ongoing Shipment Tracking"
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'tracking' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('tracking'); setShowSidebar(false); }}
          >
            <MdLocationOn size={20} />
            Tracking
          </button>
          <button
            title="Edit Your Profile"
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('profile'); setShowSidebar(false); }}
          >
            <MdPerson size={20} />
            Edit Profile
          </button>
        </nav>

        <div className="mt-6 pt-4 border-t">
          <button
            title="Logout"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded flex items-center gap-3"
          >
            <MdExitToApp size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 mt-4 md:mt-0">
        {activeTab === 'overview' && <SummaryOverview role="transporter" />}
        {activeTab === 'available' && <AvailableShipments />}
        {activeTab === 'myShipments' && <MyShipments />}
        {activeTab === 'tracking' && <OngoingTracking />}
        {activeTab === 'profile' && <UserProfile />}
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around md:hidden shadow-md z-50">
        <button
          title="Available Shipments"
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-1 text-sm flex flex-col items-center ${activeTab === 'available' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
        >
          <MdLocalShipping size={20} />
          Avail.
        </button>
        <button
          title="My Shipments"
          onClick={() => setActiveTab('myShipments')}
          className={`flex-1 py-1 text-sm flex flex-col items-center ${activeTab === 'myShipments' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
        >
          <MdAssignment size={20} />
          Mine
        </button>
        <button
          title="Tracking"
          onClick={() => setActiveTab('tracking')}
          className={`flex-1 py-1 text-sm flex flex-col items-center ${activeTab === 'tracking' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
        >
          <MdLocationOn size={20} />
          Track
        </button>
        <button
          title="Edit Profile"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-1 text-sm flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
        >
          <MdPerson size={20} />
          Profile
        </button>
        <button
          title="Logout"
          onClick={handleLogout}
          className="flex-1 py-1 text-sm text-red-500 flex flex-col items-center"
        >
          <MdExitToApp size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default TransporterDashboard;

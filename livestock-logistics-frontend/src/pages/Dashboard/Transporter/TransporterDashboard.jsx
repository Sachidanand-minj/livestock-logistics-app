import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SummaryOverview from '../../../components/SummaryOverview';
import AvailableShipments from './AvailableShipments';
import MyShipments from './MyShipments';
import OngoingTracking from './OngoingTracking';
import UserProfile from '../../Common/UserProfile';
import SidebarProfile from '../../Common/SidebarProfile';


const TransporterDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1) Read initial tab from ?tab=...
  const qp = new URLSearchParams(location.search);
  const initialTab = qp.get('tab') || 'available';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSidebar, setShowSidebar] = useState(false);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Keep tab in sync when URL changes (back/forward)
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('tab');
    if (q && q !== activeTab) setActiveTab(q);
  }, [location.search]);

  // Push tab changes into the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== activeTab) {
      params.set('tab', activeTab);
      navigate({ pathname: '/dashboard', search: params.toString() }, {
        replace: true
      });
    }
  }, [activeTab]);

  // Auto-hide mobile sidebar on resize
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
        <h2 className="text-lg font-semibold text-blue-600">Transporter</h2>
        <button onClick={() => setShowSidebar(x => !x)} className="text-gray-600 text-2xl">☰</button>
      </div>

      {/* Sidebar */}
      <aside className={`
          fixed md:static top-0 left-0 h-full bg-white z-50
          transform transition-transform duration-300 ease-in-out
          border-r shadow-sm p-4 w-64
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}>
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setShowSidebar(false)} className="text-gray-500">✕</button>
        </div>

        <SidebarProfile />

        <nav className="space-y-2 mt-6">
        <button
            className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'overview' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('overview'); setShowSidebar(false); }}
          >
            Dashboard
          </button>
          <button
            className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'available' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('available'); setShowSidebar(false); }}
          >
            Available Shipments
          </button>
          <button
            className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'myShipments' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('myShipments'); setShowSidebar(false); }}
          >
            My Shipments
          </button>
          <button
            className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'tracking' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('tracking'); setShowSidebar(false); }}
          >
            Tracking
          </button>
          <button
            className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
              activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => { setActiveTab('profile'); setShowSidebar(false); }}
          >
            Edit Profile
          </button>
        </nav>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 mt-4 md:mt-0">
        {activeTab==='overview' && <SummaryOverview role="transporter" />}
        {activeTab === 'available'    && <AvailableShipments />}
        {activeTab === 'myShipments'  && <MyShipments />}
        {activeTab === 'tracking'     && <OngoingTracking />}
        {activeTab === 'profile'      && <UserProfile />}
      </main>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around md:hidden shadow-md z-50">
        <button onClick={() => setActiveTab('available')}    className={`flex-1 py-1 text-sm ${activeTab==='available' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Avail.</button>
        <button onClick={() => setActiveTab('myShipments')}  className={`flex-1 py-1 text-sm ${activeTab==='myShipments' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Mine</button>
        <button onClick={() => setActiveTab('tracking')}     className={`flex-1 py-1 text-sm ${activeTab==='tracking' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Track</button>
        <button onClick={() => setActiveTab('profile')}      className={`flex-1 py-1 text-sm ${activeTab==='profile' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Profile</button>
        <button onClick={handleLogout}                       className="flex-1 py-1 text-sm text-red-500">Logout</button>
      </nav>
    </div>
);
}
export default TransporterDashboard;

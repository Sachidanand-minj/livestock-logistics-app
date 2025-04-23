import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SummaryOverview from '../../../components/SummaryOverview';
import SidebarProfile from '../../Common/SidebarProfile';
import UserList from './UserList';
import ShipmentMonitor from './ShipmentMonitor';
import AdminTracking from './AdminTracking';
import UserProfile from '../../Common/UserProfile';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1️⃣ read initial tab from the URL
  const params      = new URLSearchParams(location.search);
  const initialTab  = params.get('tab') || 'users';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [showSidebar, setShowSidebar] = useState(false);

  // logout helper
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // 2️⃣ when URL changes (back/forward), sync activeTab
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('tab');
    if (q && q !== activeTab) {
      setActiveTab(q);
    }
  }, [location.search]);

  // 3️⃣ whenever activeTab changes, push it into the URL
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('tab') !== activeTab) {
      p.set('tab', activeTab);
      navigate(
        { pathname: '/dashboard', search: p.toString() },
        { replace: true }
      );
    }
  }, [activeTab]);

  // auto-hide mobile sidebar on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* ─── Mobile Topbar ───────────────────────── */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600">Admin Dashboard</h2>
        <button
          onClick={() => setShowSidebar(x => !x)}
          className="text-gray-600 text-2xl"
        >
          ☰
        </button>
      </div>

      {/* ─── Sidebar ───────────────────────────────── */}
      <aside className={`
          fixed md:static top-0 left-0 h-full bg-white z-50 p-4 w-64 border-r shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}>
        {/* mobile close */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setShowSidebar(false)} className="text-gray-500">✕</button>
        </div>

        <SidebarProfile />

        <nav className="space-y-2 mt-6">
          {[
            { key:'overview', label:'Dashboard' },
            { key: 'users',     label: 'User List'         },
            { key: 'shipments', label: 'Shipment Monitor'  },
            { key: 'tracking',  label: 'Tracking'          },
            { key: 'profile',   label: 'Edit Profile'      },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setShowSidebar(false); }}
              className={`
                block w-full text-left px-4 py-2 rounded hover:bg-blue-100
                ${activeTab === key ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              `}
            >
              {label}
            </button>
          ))}
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

      {/* ─── Main Content ───────────────────────────── */}
      <main className="flex-1 p-4 mt-4 md:mt-0">
        {activeTab==='overview' && <SummaryOverview role="admin" />}
        {activeTab === 'users'     && <UserList />}
        {activeTab === 'shipments' && <ShipmentMonitor />}
        {activeTab === 'tracking'  && <AdminTracking />}
        {activeTab === 'profile'   && <UserProfile />}
      </main>

      {/* ─── Mobile Bottom Nav ──────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around md:hidden shadow-md z-50">
        {['users','shipments','tracking','profile'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-sm py-1 ${
              activeTab===tab ? 'text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            {tab === 'users'     ? 'Users'
             : tab === 'shipments' ? 'Shipments'
             : tab === 'tracking'  ? 'Tracking'
             : 'Profile'}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex-1 text-sm text-red-500 py-1"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminDashboard;
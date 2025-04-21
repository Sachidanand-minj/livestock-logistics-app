import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import ShipmentMonitor from './ShipmentMonitor';
import SidebarProfile from '../../Common/SidebarProfile';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600">Admin Dashboard</h2>
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-gray-600 text-2xl">☰</button>
      </div>

      <aside className={`fixed md:static border-t top-0 left-0 h-full bg-white z-50 transition-transform duration-300 ease-in-out border-r shadow-sm p-4 w-64 
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="md:hidden flex justify-end">
          <button onClick={() => setShowSidebar(false)} className="text-gray-500 mb-4">✕</button>
        </div>

        <SidebarProfile />
        <nav className="space-y-2">
          <button onClick={() => { setActiveTab('users'); setShowSidebar(false); }} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'users' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>User List</button>
          <button onClick={() => { setActiveTab('shipments'); setShowSidebar(false); }} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'shipments' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>Shipment Monitor</button>
        </nav>

        <div className="mt-6 pt-4 border-t">
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded">
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 mt-4 md:mt-0">
        {activeTab === 'users' && <UserList />}
        {activeTab === 'shipments' && <ShipmentMonitor />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around md:hidden shadow-md z-50">
        <button onClick={() => setActiveTab('users')} className={`flex-1 text-sm py-1 ${activeTab === 'users' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Users</button>
        <button onClick={() => setActiveTab('shipments')} className={`flex-1 text-sm py-1 ${activeTab === 'shipments' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Shipments</button>
        <button onClick={handleLogout} className="flex-1 text-sm text-red-500 py-1">Logout</button>
      </nav>
    </div>
  );
};

export default AdminDashboard;


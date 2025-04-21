import React, { useState, useEffect } from 'react';
import AvailableShipments from './AvailableShipments';
import MyShipments from './MyShipments';
import UserProfile from '../../Common/UserProfile';
import SidebarProfile from '../../Common/SidebarProfile';
import { useNavigate } from 'react-router-dom';

const TransporterDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');
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
        <h2 className="text-lg font-semibold text-blue-600">Transporter Dashboard</h2>
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-gray-600 text-2xl">☰</button>
      </div>

      <aside className={`fixed md:static border-t top-0 left-0 h-full bg-white z-50 transition-transform duration-300 ease-in-out border-r shadow-sm p-4 w-64 
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="md:hidden flex justify-end">
          <button onClick={() => setShowSidebar(false)} className="text-gray-500 mb-4">✕</button>
        </div>

        <SidebarProfile />
        <nav className="space-y-2">
          <button onClick={() => { setActiveTab('available'); setShowSidebar(false); }} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'available' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>Available Shipments</button>
          <button onClick={() => { setActiveTab('myShipments'); setShowSidebar(false); }} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'myShipments' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>My Shipments</button>
          <button onClick={() => { setActiveTab('profile'); setShowSidebar(false); }} className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>Edit Profile</button>
        </nav>

        <div className="mt-6 pt-4 border-t">
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded">
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 mt-4 md:mt-0">
        {activeTab === 'available' && <AvailableShipments />}
        {activeTab === 'myShipments' && <MyShipments />}
        {activeTab === 'profile' && <UserProfile />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around md:hidden shadow-md z-50">
        <button onClick={() => setActiveTab('available')} className={`flex-1 text-sm py-1 ${activeTab === 'available' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Available</button>
        <button onClick={() => setActiveTab('myShipments')} className={`flex-1 text-sm py-1 ${activeTab === 'myShipments' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>My Loads</button>
        <button onClick={() => setActiveTab('profile')} className={`flex-1 text-sm py-1 ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>Profile</button>
        <button onClick={handleLogout} className="flex-1 text-sm text-red-500 py-1">Logout</button>
      </nav>
    </div>
  );
};

export default TransporterDashboard;

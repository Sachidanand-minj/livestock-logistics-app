import React, { useState } from 'react';
import AvailableShipments from './AvailableShipments';
import MyShipments from './MyShipments';

const TransporterDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Transporter Panel</h2>
        <ul className="space-y-4">
          <li>
            <button onClick={() => setActiveTab('available')} className={`w-full text-left ${activeTab === 'available' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              Available Shipments
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('mine')} className={`w-full text-left ${activeTab === 'mine' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              My Shipments
            </button>
          </li>
        </ul>
      </div>

      {/* Content Panel */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {activeTab === 'available' && <AvailableShipments />}
        {activeTab === 'mine' && <MyShipments />}
      </div>
    </div>
  );
};

export default TransporterDashboard;

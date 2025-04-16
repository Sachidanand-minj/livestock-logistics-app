import React, { useState } from 'react';
import CreateShipment from './CreateShipment';
import ViewShipments from './ViewShipments';

const SenderDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Sender Panel</h2>
        <ul className="space-y-4">
          <li>
            <button onClick={() => setActiveTab('create')} className={`w-full text-left ${activeTab === 'create' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              Create Shipment
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('view')} className={`w-full text-left ${activeTab === 'view' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              View Shipments
            </button>
          </li>
        </ul>
      </div>

      {/* Main Panel */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {activeTab === 'create' && <CreateShipment />}
        {activeTab === 'view' && <ViewShipments />}
      </div>
    </div>
  );
};

export default SenderDashboard;

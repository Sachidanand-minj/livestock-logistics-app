import React, { useEffect, useState } from 'react';

const ShipmentMonitor = () => {
  const [shipments, setShipments] = useState([]);
  const token = localStorage.getItem('token');

  const fetchShipments = async () => {
    const res = await fetch('http://localhost:5000/api/shipment/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) setShipments(data);
    else alert('Failed to load shipments');
  };

  const deleteShipment = async (id) => {
    if (!window.confirm('Delete this shipment?')) return;

    const res = await fetch(`http://localhost:5000/api/admin/shipments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert('Shipment deleted!');
      fetchShipments();
    } else {
      alert(data.error || 'Failed to delete shipment');
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h3 className="text-xl font-bold mb-4">All Shipments</h3>
      {shipments.map((s) => (
        <div key={s._id} className="bg-white p-4 mb-4 rounded shadow border-l-4 border-green-600">
          <h4 className="text-lg font-semibold">{s.livestockType} ({s.quantity})</h4>
          <p className="text-sm text-gray-600">From: {s.source} → To: {s.destination}</p>
          <p className="text-sm mt-1">
            Status: <span className="font-semibold text-blue-600">{s.status}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Sender: {s.senderId?.name}</p>
          <p className="text-sm text-gray-500">Transporter: {s.transporterId?.name || 'N/A'}</p>

          <button
            onClick={() => deleteShipment(s._id)}
            className="mt-2 text-red-500 text-sm hover:underline"
          >
            Delete Shipment
          </button>
        </div>
      ))}
    </div>
  );
};

export default ShipmentMonitor;

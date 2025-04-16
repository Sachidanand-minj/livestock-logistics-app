import React, { useEffect, useState } from 'react';

const AvailableShipments = () => {
  const [shipments, setShipments] = useState([]);
  const token = localStorage.getItem('token');

  const fetchAvailableShipments = async () => {
    const res = await fetch('http://localhost:5000/api/shipment/all', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      const filtered = data.filter(
        (s) => s.status === 'Unassigned' && !s.transporterId
      );
      setShipments(filtered);
    }
  };

  useEffect(() => {
    fetchAvailableShipments();
  }, []);

  const acceptShipment = async (shipmentId) => {
    const res = await fetch(`http://localhost:5000/api/shipment/${shipmentId}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      alert('Shipment accepted!');
      fetchAvailableShipments();
    } else {
      alert(data.error || 'Failed to accept shipment');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Available Shipments</h3>
      <div className="grid gap-4 max-w-5xl mx-auto">
        {shipments.length === 0 ? (
          <p className="text-center text-gray-500">No shipments available right now.</p>
        ) : (
          shipments.map((s) => (
            <div key={s._id} className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
              <h4 className="text-lg font-semibold">{s.livestockType} ({s.quantity})</h4>
              <p className="text-sm text-gray-600">From: {s.source}</p>
              <p className="text-sm text-gray-600">To: {s.destination}</p>
              <p className="text-sm mt-2 font-medium text-yellow-600">Status: {s.status}</p>

              <button
                onClick={() => acceptShipment(s._id)}
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Accept Shipment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableShipments;

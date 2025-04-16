import React, { useEffect, useState } from 'react';

const MyShipments = () => {
  const [myShipments, setMyShipments] = useState([]);
  const token = localStorage.getItem('token');
  const transporterId = localStorage.getItem('userId');

  const fetchMyShipments = async () => {
    const res = await fetch('http://localhost:5000/api/shipment/all', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      const filtered = data.filter(
        (s) => s.transporterId && s.transporterId._id === transporterId
      );
      setMyShipments(filtered);
    }
  };

  useEffect(() => {
    fetchMyShipments();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">My Accepted Shipments</h3>
      <div className="grid gap-4 max-w-5xl mx-auto">
        {myShipments.length === 0 ? (
          <p className="text-center text-gray-500">You haven’t accepted any shipments yet.</p>
        ) : (
          myShipments.map((s) => (
            <div key={s._id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
              <h4 className="text-lg font-semibold">{s.livestockType} ({s.quantity})</h4>
              <p className="text-sm text-gray-600">From: {s.source}</p>
              <p className="text-sm text-gray-600">To: {s.destination}</p>
              <p className="text-sm mt-2 font-medium text-blue-600">Status: {s.status}</p>

              {s.status === 'Confirmed' && (
                <button
                  onClick={() => alert('Start tracking logic here')}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Start Tracking
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyShipments;

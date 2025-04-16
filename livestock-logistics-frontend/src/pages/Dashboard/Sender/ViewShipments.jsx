import React, { useEffect, useState } from 'react';

const ViewShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  const token = localStorage.getItem('token');
  const senderId = localStorage.getItem('userId');

  const fetchShipments = async () => {
    const res = await fetch('http://localhost:5000/api/shipment/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      const myShipments = data.filter(
        (s) => s.senderId === senderId || s.senderId?._id === senderId
      );
      setShipments(myShipments);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const confirmTransporter = async (shipmentId) => {
    const res = await fetch(`http://localhost:5000/api/shipment/${shipmentId}/confirm`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert('Transporter confirmed!');
      fetchShipments();
    } else {
      alert(data.error || 'Error confirming transporter');
    }
  };

  const filteredShipments = shipments.filter((s) => {
    if (statusFilter === 'All') return true;
    return s.status === statusFilter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4 max-w-5xl mx-auto">
        <h3 className="text-xl font-bold">My Shipments</h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Unassigned">Unassigned</option>
          <option value="Pending Confirmation">Pending Confirmation</option>
          <option value="Confirmed">Confirmed</option>
        </select>
      </div>

      <div className="grid gap-4 max-w-5xl mx-auto">
        {filteredShipments.length === 0 ? (
          <p className="text-center text-gray-600">No shipments found.</p>
        ) : (
          filteredShipments.map((s) => (
            <div key={s._id} className="bg-white shadow rounded p-4 border-l-4 border-green-500">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-lg font-bold">{s.livestockType} ({s.quantity})</h4>
                  <p className="text-sm text-gray-600">From: {s.source}</p>
                  <p className="text-sm text-gray-600">To: {s.destination}</p>
                  <p className="text-sm mt-2 font-semibold">
                    Status:{" "}
                    <span className={
                      s.status === 'Confirmed' ? 'text-green-600' :
                      s.status === 'Pending Confirmation' ? 'text-yellow-600' :
                      'text-gray-500'
                    }>
                      {s.status}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  {s.transporterId ? (
                    <div className="text-sm text-left">
                      <p className="font-semibold text-blue-700">{s.transporterId.name}</p>
                      <p className="text-gray-600">{s.transporterId.email}</p>
                      {s.transporterId.phone && <p className="text-gray-600">{s.transporterId.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Not Accepted</p>
                  )}
                </div>
              </div>

              {s.status === 'Pending Confirmation' && !s.isConfirmed && (
                <button
                  onClick={() => confirmTransporter(s._id)}
                  className="mt-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Confirm Transporter
                </button>
              )}

              {s.status === 'Confirmed' && (
                <p className="mt-4 text-sm text-green-600 font-semibold">Transporter Confirmed ✔</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewShipments;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingProofs = () => {
  const [pendingShipments, setPendingShipments] = useState([]);
  const token = localStorage.getItem('token');
  const API = import.meta.env.VITE_API_URL || 'https://livestocklogistics.animbiz.com';

  useEffect(() => {
    const fetchPendingProofs = async () => {
      try {
        const res = await axios.get(`${API}/api/shipment/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || [];
        const pending = data.filter(s => s.status === 'Confirmed' && s.proofUploaded && !s.proofVerified && !s.proofRejected);
        setPendingShipments(pending);
      } catch (err) {
        console.error('Error fetching pending proofs:', err);
      }
    };

    fetchPendingProofs();
  }, []);

  const handleApproval = async (shipmentId, approved) => {
    try {
      await axios.patch(
        `${API}/api/admin/verify-proof/${shipmentId}`,
        { approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingShipments(prev => prev.filter(s => s._id !== shipmentId));
    } catch (err) {
      console.error('Error updating proof status:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Proof Uploads</h2>

      {pendingShipments.length === 0 ? (
        <p className="text-gray-500">✅ No pending proofs for approval.</p>
      ) : (
        pendingShipments.map((s) => (
          <div key={s._id} className="bg-white p-4 rounded shadow border mb-4">
            <p className="font-medium text-gray-800">Livestock: {s.livestockType} ({s.quantity})</p>
            <p className="text-sm text-gray-600">From: {s.source} → To: {s.destination}</p>
            <div className="flex items-center gap-4 mt-3">
              <img
                src={`${API}/livestock-logistics-backend/${s.proofPhoto}`}
                alt="Proof"
                className="w-24 h-16 object-cover rounded border"
              />
              <video
                src={`${API}/livestock-logistics-backend/${s.proofVideo}`}
                controls
                className="w-48 h-24 rounded border"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleApproval(s._id, true)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >✅ Approve</button>
              <button
                onClick={() => handleApproval(s._id, false)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >❌ Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingProofs;

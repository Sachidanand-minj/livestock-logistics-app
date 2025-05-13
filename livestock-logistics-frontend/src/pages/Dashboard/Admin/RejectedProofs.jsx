import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RejectedProofs = () => {
  const [rejected, setRejected] = useState([]);
  const token = localStorage.getItem('token');
  const BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRejected = async () => {
      try {
        const res = await axios.get(`${BASE}/api/shipment/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const filtered = res.data.filter(
          s => s.proofRejected === true
        );
        setRejected(filtered);
      } catch (err) {
        console.error('Error fetching rejected proofs:', err);
      }
    };

    fetchRejected();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Rejected Proofs</h2>
      {rejected.length === 0 ? (
        <p className="text-gray-500">✅ No rejected proofs.</p>
      ) : (
        rejected.map((s) => (
          <div key={s._id} className="bg-white p-4 rounded shadow border mb-4">
            <p className="font-medium">Livestock: {s.livestockType} ({s.quantity})</p>
            <p className="text-sm text-gray-600">From: {s.source} → To: {s.destination}</p>
            <div className="flex items-center gap-4 mt-3">
              <img src={`${BASE}/livestock-logistics-backend/${s.proofPhoto}`} alt="Proof" className="w-24 h-16 object-cover rounded border" />
              <video src={`${BASE}/livestock-logistics-backend/${s.proofVideo}`} controls className="w-48 h-24 rounded border" />
            </div>
            <p className="text-red-600 font-medium mt-2">❌ This proof was rejected</p>
          </div>
        ))
      )}
    </div>
  );
};

export default RejectedProofs;

// src/components/SummaryOverview.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const SummaryOverview = ({ role }) => {
  const token  = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // always fetch all shipments
        const shpRes = await fetch('https://livestocklogistics.animbiz.com/api/shipment/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const shipments = (await shpRes.json()) || [];

        let summary = {};

        if (role === 'sender') {
          // only your shipments
          const mine = shipments.filter(s =>
            s.senderId === userId || (s.senderId?._id === userId)
          );
          summary = {
            total: mine.length,
            pending: mine.filter(s => s.status === 'Pending Confirmation').length,
            confirmed: mine.filter(s => s.status === 'Confirmed').length,
            inTransit: mine.filter(s => s.status === 'In Transit').length
          };
        }
        else if (role === 'transporter') {
          // available to pick
          const available = shipments.filter(s => !s.transporterId);
          // assigned to you
          const mine = shipments.filter(s =>
            s.transporterId && (s.transporterId._id === userId)
          );
          summary = {
            available: available.length,
            assigned: mine.length,
            inTransit: mine.filter(s => s.status === 'In Transit').length,
            delivered: mine.filter(s => s.status === 'Delivered').length
          };
        }
        else if (role === 'admin') {
          // fetch users too
          const usrRes = await fetch('https://livestocklogistics.animbiz.com/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const users = await usrRes.json();
          summary = {
            totalUsers: users.length,
            totalShipments: shipments.length,
            pending: shipments.filter(s => s.status === 'Pending Confirmation').length,
            confirmed: shipments.filter(s => s.status === 'Confirmed').length
          };
        }

        setStats(summary);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load summary');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, userId, token]);

  if (loading) {
    return <p className="text-center py-8 animate-pulse">Loading overview…</p>;
  }

  // build cards
  const cards = Object.entries(stats).map(([key, val]) => {
    const label = key
      .replace(/([A-Z])/g, ' $1')  // camel → spaces
      .replace(/^./, str => str.toUpperCase());

    return (
      <div key={key} className="bg-white rounded shadow p-4 flex-1 min-w-[120px]">
        <p className="text-2xl font-bold">{val}</p>
        <p className="text-gray-600">{label}</p>
      </div>
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Overview</h3>
      <div className="flex flex-wrap gap-4">{cards}</div>
    </div>
  );
};

export default SummaryOverview;

// src/pages/Dashboard/Admin/AdminTracking.jsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'GOOGLE_MAPS_API_KEY';

const AdminTracking = () => {
  const [shipments, setShipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalShipment, setModalShipment] = useState(null);
  // Filters
  const [statusFilter, setStatusFilter]       = useState('All');
  const [shipIdSearch, setShipIdSearch]       = useState('');
  const [senderSearch, setSenderSearch]       = useState('');
  const [transporterSearch, setTransporterSearch] = useState('');
  const [livestockFilter, setLivestockFilter] = useState('All');
  const [originSearch, setOriginSearch]       = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [dateFrom, setDateFrom]               = useState('');
  const [dateTo, setDateTo]                   = useState('');

  const token = localStorage.getItem('token');
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res  = await fetch('http://localhost:5000/api/shipment/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setShipments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
    const iv = setInterval(fetchAll, 10000);
    return () => clearInterval(iv);
  }, [token]);

  // Apply filters
  const filtered = shipments.filter(s => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (shipIdSearch && !s._id.includes(shipIdSearch)) return false;
    if (senderSearch && !s.senderId?.name.toLowerCase().includes(senderSearch.toLowerCase())) return false;
    if (transporterSearch && !s.transporterId?.name.toLowerCase().includes(transporterSearch.toLowerCase())) return false;
    if (livestockFilter !== 'All' && s.livestockType !== livestockFilter) return false;
    if (originSearch && !s.source.toLowerCase().includes(originSearch.toLowerCase())) return false;
    if (destinationSearch && !s.destination.toLowerCase().includes(destinationSearch.toLowerCase())) return false;
    if (dateFrom && new Date(s.createdAt) < new Date(dateFrom)) return false;
    if (dateTo   && new Date(s.createdAt) > new Date(dateTo))   return false;
    return (s.status === 'In Transit' && s.currentLocation);
  });

  const openMap = s => { setModalShipment(s); setShowModal(true); };
  const closeMap = () => { setShowModal(false); setModalShipment(null); };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded">
          <option>All</option>
          <option>Unassigned</option>
          <option>Pending Confirmation</option>
          <option>In Transit</option>
          <option>Delivered</option>
        </select>
        <input
          placeholder="Shipment ID"
          className="p-2 border rounded"
          value={shipIdSearch}
          onChange={e => setShipIdSearch(e.target.value)}
        />
        <input
          placeholder="Sender Name"
          className="p-2 border rounded"
          value={senderSearch}
          onChange={e => setSenderSearch(e.target.value)}
        />
        <input
          placeholder="Transporter Name"
          className="p-2 border rounded"
          value={transporterSearch}
          onChange={e => setTransporterSearch(e.target.value)}
        />
        <select value={livestockFilter} onChange={e => setLivestockFilter(e.target.value)} className="p-2 border rounded">
          <option>All Livestock</option>
          <option>Cattle</option>
          <option>Goat</option>
          <option>Poultry</option>
        </select>
        <input
          placeholder="Origin"
          className="p-2 border rounded"
          value={originSearch}
          onChange={e => setOriginSearch(e.target.value)}
        />
        <input
          placeholder="Destination"
          className="p-2 border rounded"
          value={destinationSearch}
          onChange={e => setDestinationSearch(e.target.value)}
        />
        <label className="flex items-center space-x-2">
          <span>From:</span>
          <input type="date" className="p-2 border rounded" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </label>
        <label className="flex items-center space-x-2">
          <span>To:</span>
          <input type="date" className="p-2 border rounded" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No in‑transit shipments match your filters.</p>
      ) : (
        filtered.map(s => (
          <div
            key={s._id}
            className="bg-white p-4 rounded shadow border-l-4 border-red-500 flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{s.livestockType} ({s.quantity})</h4>
              <p className="text-sm text-gray-600">From: {s.source} → To: {s.destination}</p>
              <p className="text-sm text-red-600 mt-1">
                📍 Lat {s.currentLocation.lat.toFixed(4)}, Lng {s.currentLocation.lng.toFixed(4)}
              </p>
            </div>
            <button onClick={() => openMap(s)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              View on Map
            </button>
          </div>
        ))
      )}

      {/* Map Modal */}
      {showModal && modalShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
            <button onClick={closeMap} className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-2xl">&times;</button>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Tracking: {modalShipment.livestockType}</h3>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '400px' }}
                  zoom={12}
                  center={{
                    lat: modalShipment.currentLocation.lat,
                    lng: modalShipment.currentLocation.lng
                  }}
                >
                  <Marker
                    position={{
                      lat: modalShipment.currentLocation.lat,
                      lng: modalShipment.currentLocation.lng
                    }}
                    label={modalShipment.livestockType}
                  />
                </GoogleMap>
              ) : (
                <p>Loading map…</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTracking;

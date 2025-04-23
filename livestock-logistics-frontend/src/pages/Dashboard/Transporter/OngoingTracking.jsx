// src/pages/Dashboard/Transporter/OngoingTracking.jsx
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const socket = io('http://localhost:5000');
const GOOGLE_MAPS_API_KEY = 'AIzaSyBW98Mn251z5in7weHa7xkx75-cPysttgY';

const OngoingTracking = () => {
  const [shipments, setShipments] = useState([]);
  const [markers, setMarkers]       = useState({});
  // Filters
  const [livestockFilter, setLivestockFilter] = useState('All');
  const [originSearch, setOriginSearch]       = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');

  const token  = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
  const mapRef = useRef(null);

  // Fetch In‑Transit shipments
  useEffect(() => {
    const fetchTrackingShipments = async () => {
      const res  = await fetch('http://localhost:5000/api/shipment/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        const assigned = data.filter(
          s => s.status === 'In Transit' && s.transporterId?._id === userId
        );
        setShipments(assigned);
        // set initial markers
        const locs = {};
        assigned.forEach(s => {
          if (s.currentLocation)
            locs[s._id] = { lat: s.currentLocation.lat, lng: s.currentLocation.lng };
        });
        setMarkers(locs);
      }
    };

    fetchTrackingShipments();
    socket.on('locationUpdated', ({ shipmentId, lat, lng }) => {
      setMarkers(prev => ({ ...prev, [shipmentId]: { lat, lng } }));
    });

    return () => socket.off('locationUpdated');
  }, [token, userId]);

  // Apply filters
  const filtered = shipments.filter(s => {
    if (livestockFilter !== 'All' && s.livestockType !== livestockFilter) return false;
    if (originSearch && !s.source.toLowerCase().includes(originSearch.toLowerCase())) return false;
    if (destinationSearch && !s.destination.toLowerCase().includes(destinationSearch.toLowerCase())) return false;
    return true;
  });

  const mapStyle   = { height: '60vh', width: '100%' };
  const defaultCenter = { lat: 23.2599, lng: 77.4126 };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="p-2 border rounded"
          value={livestockFilter}
          onChange={e => setLivestockFilter(e.target.value)}
        >
          <option value="All">All Livestock</option>
          <option value="Cattle">Cattle</option>
          <option value="Goat">Goat</option>
          <option value="Poultry">Poultry</option>
        </select>
        <input
          className="p-2 border rounded"
          placeholder="Origin"
          value={originSearch}
          onChange={e => setOriginSearch(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Destination"
          value={destinationSearch}
          onChange={e => setDestinationSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No shipments match your filters.</p>
      ) : (
        isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapStyle}
            zoom={5}
            center={defaultCenter}
            onLoad={map => (mapRef.current = map)}
          >
            {filtered.map(s => {
              const m = markers[s._id];
              return m ? (
                <Marker
                  key={s._id}
                  position={m}
                  label={s.livestockType}
                  title={`${s.source} → ${s.destination}`}
                />
              ) : null;
            })}
          </GoogleMap>
        ) : (
          <p>Loading map…</p>
        )
      )}
    </div>
  );
};

export default OngoingTracking;

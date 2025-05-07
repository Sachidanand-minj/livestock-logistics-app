import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('https://livestocklogistics.animbiz.com/');

const ViewShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [shipmentsPerPage, setShipmentsPerPage] = useState(3);
  const [selectedShipmentId, setSelectedShipmentId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const token = localStorage.getItem('token');
  const senderId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstance = useRef(null);

  const fetchShipments = async () => {
    const res = await fetch('https://livestocklogistics.animbiz.com/api/shipment/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  useEffect(() => {
    if (!selectedShipmentId || !isTracking) return;
    socket.on('locationUpdated', ({ shipmentId, lat, lng }) => {
      if (shipmentId === selectedShipmentId) {
        if (!mapInstance.current) {
          initMap(lat, lng);
        } else {
          updateMarker(lat, lng);
        }
      }
    });
    return () => socket.off('locationUpdated');
  }, [selectedShipmentId, isTracking]);

  const initMap = (lat, lng) => {
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 12,
    });
    markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: mapInstance.current,
      title: 'Shipment Location',
    });
  };

  const updateMarker = (lat, lng) => {
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
      mapInstance.current.setCenter({ lat, lng });
    }
  };

  const confirmTransporter = async (shipmentId) => {
    const res = await fetch(`https://livestocklogistics.animbiz.com/api/shipment/${shipmentId}/confirm`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      alert('Transporter confirmed!');
      setShipments((prev) =>
        prev.map((s) =>
          s._id === shipmentId ? { ...s, status: 'Confirmed', isConfirmed: true } : s
        )
      );
    } else {
      alert(data.error || 'Error confirming transporter');
    }
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const statusMatch = statusFilter === 'All' || s.status === statusFilter;
      const searchMatch =
        s.livestockType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [shipments, searchTerm, statusFilter]);

  const indexOfLast = currentPage * shipmentsPerPage;
  const indexOfFirst = indexOfLast - shipmentsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredShipments.length / shipmentsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (e) => {
    setShipmentsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 max-w-5xl mx-auto gap-4">
        <h3 className="text-xl font-bold">My Shipments</h3>
        <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search livestock, source or destination..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border rounded w-full md:w-64"
          />
          <select value={statusFilter} onChange={handleStatusChange} className="p-2 border rounded">
            <option value="All">All</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Pending Confirmation">Pending Confirmation</option>
            <option value="Confirmed">Confirmed</option>
          </select>
          <select value={shipmentsPerPage} onChange={handlePerPageChange} className="p-2 border rounded">
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 max-w-5xl mx-auto">
        {currentShipments.length === 0 ? (
          <p className="text-center text-gray-600">No shipments found.</p>
        ) : (
          currentShipments.map((s) => (
            <div key={s._id} className="bg-white shadow rounded p-4 border-l-4 border-green-500">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-lg font-bold">{s.livestockType} ({s.quantity})</h4>
                  <p className="text-sm text-gray-600">From: {s.source}</p>
                  <p className="text-sm text-gray-600">To: {s.destination}</p>
                  <p className="text-sm mt-2 font-semibold">
                    Status:{' '}
                    <span className={
                      s.status === 'Confirmed'
                        ? 'text-green-600'
                        : s.status === 'Pending Confirmation'
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }>
                      {s.status}
                    </span>
                  </p>
                  {s.status === 'Confirmed' && s.isTracking && (
                    <p className="text-sm text-blue-500 mt-2 cursor-pointer" onClick={() => {
                      setSelectedShipmentId(s._id);
                      setIsTracking(true);
                    }}>
                      📍 Live tracking in progress (view map)
                    </p>
                  )}
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
                <p className="mt-4 text-sm text-green-600 font-semibold">
                  Transporter Confirmed ✔
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Google Map Section */}
      {isTracking && (
        <div className="max-w-5xl mx-auto mt-6">
          <h4 className="text-lg font-semibold mb-2">Live Shipment Tracking</h4>
          <div ref={mapRef} className="w-full h-[400px] border rounded" />
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewShipments;



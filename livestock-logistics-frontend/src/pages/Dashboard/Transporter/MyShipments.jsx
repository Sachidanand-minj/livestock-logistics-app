import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ProofUpload from '../../../components/ProofUpload';

const socket = io('https://livestocklogistics.animbiz.com/');

const MyShipments = () => {
  const [myShipments, setMyShipments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shipmentsPerPage, setShipmentsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [trackingId, setTrackingId] = useState(null);

  const token = localStorage.getItem('token');
  const transporterId = localStorage.getItem('userId');

  const handleStartTracking = (shipmentId) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setTrackingId(shipmentId);

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('locationUpdate', {
          shipmentId,
          lat: latitude,
          lng: longitude
        });
      },
      (error) => {
        console.error('Error fetching location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const fetchMyShipments = async () => {
    const res = await fetch('https://livestocklogistics.animbiz.com/api/shipment/all', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      const filtered = data.filter(
        (s) =>
          (s.transporterId && s.transporterId._id === transporterId) ||
          s.status === 'Unassigned'
      );
      setMyShipments(filtered);
    }
  };

  useEffect(() => {
    fetchMyShipments();
  }, []);

  const filteredShipments = myShipments.filter((s) => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesSearch =
      s.livestockType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const indexOfLastShipment = currentPage * shipmentsPerPage;
  const indexOfFirstShipment = indexOfLastShipment - shipmentsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirstShipment, indexOfLastShipment);
  const totalPages = Math.ceil(filteredShipments.length / shipmentsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-5xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search livestock, source or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="All">All</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Pending Confirmation">Pending Confirmation</option>
            <option value="Confirmed">Confirmed</option>
          </select>

          <label className="text-sm font-medium ml-4">Per Page:</label>
          <select
            value={shipmentsPerPage}
            onChange={(e) => setShipmentsPerPage(Number(e.target.value))}
            className="p-1 border rounded"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="grid gap-4 max-w-5xl mx-auto">
        {currentShipments.length === 0 ? (
          <p className="text-center text-gray-500">No shipments match your search/filter.</p>
        ) : (
          currentShipments.map((s) => (
            <div
              key={s._id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-200"
            >
              <h4 className="text-xl font-semibold mb-1">{s.livestockType} ({s.quantity})</h4>
              <p className="text-sm text-gray-600 mb-1">From: <span className="font-medium text-gray-800">{s.source}</span></p>
              <p className="text-sm text-gray-600 mb-1">To: <span className="font-medium text-gray-800">{s.destination}</span></p>
              <p className="text-sm mt-1 font-medium text-blue-600">Status: {s.status}</p>

              {s.status === 'Confirmed' && (
                <div className="mt-4 space-y-3">
                  {s.proofRejected && (
                    <>
                      <p className="text-red-600 text-sm font-medium">❌ Previous proof was rejected. Please re-upload.</p>
                      <ProofUpload
                        shipmentId={s._id}
                        onSuccess={(updated) => {
                          setMyShipments((prev) =>
                            prev.map((ship) => ship._id === updated._id ? updated : ship)
                          );
                        }}
                      />
                    </>
                  )}

                  {!s.proofUploaded && !s.proofRejected && (
                    <ProofUpload
                      shipmentId={s._id}
                      onSuccess={(updated) => {
                        setMyShipments((prev) =>
                          prev.map((ship) => ship._id === updated._id ? updated : ship)
                        );
                      }}
                    />
                  )}

                  {s.proofUploaded && s.proofStatus === 'pending' && (
                    <p className="text-yellow-600 text-sm">✅ Proof uploaded. Awaiting admin approval.</p>
                  )}

                  {s.proofStatus === 'approved' && (
                    <>
                      <button
                        onClick={() => handleStartTracking(s._id)}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      >
                        Start Tracking
                      </button>
                      {trackingId === s._id && (
                        <p className="text-sm text-green-600 mt-1">📍 Live tracking active</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
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
              className={`px-3 py-1 rounded border ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-blue-600'
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

export default MyShipments;

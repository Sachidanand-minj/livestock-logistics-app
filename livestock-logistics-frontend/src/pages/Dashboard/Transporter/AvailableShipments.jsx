import React, { useEffect, useState } from 'react';

const AvailableShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shipmentsPerPage, setShipmentsPerPage] = useState(3); // ✅ Default per page
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const token = localStorage.getItem('token');

  const fetchAvailableShipments = async () => {
    const res = await fetch('https://livestocklogistics.animbiz.com/api/shipment/all', {
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

  useEffect(() => {
    let filtered = shipments;

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter((s) => s.livestockType === typeFilter);
    }

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.livestockType.toLowerCase().includes(term) ||
          s.source.toLowerCase().includes(term) ||
          s.destination.toLowerCase().includes(term)
      );
    }

    setFilteredShipments(filtered);
    setCurrentPage(1); // Reset to page 1 after filter/search
  }, [searchTerm, typeFilter, shipments]);

  // Pagination logic
  const indexOfLastShipment = currentPage * shipmentsPerPage;
  const indexOfFirstShipment = indexOfLastShipment - shipmentsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirstShipment, indexOfLastShipment);
  const totalPages = Math.ceil(filteredShipments.length / shipmentsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const acceptShipment = async (shipmentId) => {
    const res = await fetch(`https://livestocklogistics.animbiz.com/api/shipment/${shipmentId}/accept`, {
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

  // Extract livestock types for filter dropdown
  const livestockTypes = Array.from(new Set(shipments.map((s) => s.livestockType)));

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-center">Available Shipments</h3>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-5xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search livestock, source, or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="All">All</option>
            {livestockTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
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
          <p className="text-center text-gray-500">No shipments available right now.</p>
        ) : (
          currentShipments.map((s) => (
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
              className={`px-3 py-1 rounded border ${
                currentPage === page
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

export default AvailableShipments;

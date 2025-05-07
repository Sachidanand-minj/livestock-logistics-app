import React, { useEffect, useState } from 'react';

const ShipmentMonitor = () => {
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [shipmentsPerPage, setShipmentsPerPage] = useState(3); // ✅ Default to 3 per page

  const token = localStorage.getItem('token');

  const fetchShipments = async () => {
    const res = await fetch('https://livestocklogistics.animbiz.com/api/shipment/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setShipments(data);
    } else {
      alert('Failed to load shipments');
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const deleteShipment = async (id) => {
    if (!window.confirm('Delete this shipment?')) return;

    const res = await fetch(`https://livestocklogistics.animbiz.com/api/admin/shipments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert('Shipment deleted!');
      fetchShipments();
    } else {
      alert(data.error || 'Failed to delete shipment');
    }
  };

  // Filter and search logic
  const filteredShipments = shipments.filter((s) => {
    const statusMatch =
      statusFilter === 'All' || s.status === statusFilter;
    const searchMatch =
      s.livestockType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Pagination logic
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
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePerPageChange = (e) => {
    setShipmentsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when per-page value changes
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-xl font-bold">All Shipments</h3>

        <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search livestock, source, or destination..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border rounded w-full md:w-64"
          />

          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="p-2 border rounded"
          >
            <option value="All">All Status</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Pending Confirmation">Pending Confirmation</option>
            <option value="Confirmed">Confirmed</option>
          </select>

          <select
            value={shipmentsPerPage}
            onChange={handlePerPageChange}
            className="p-2 border rounded"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {currentShipments.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 rounded shadow border-l-4 border-green-600"
          >
            <h4 className="text-lg font-semibold">
              {s.livestockType} ({s.quantity})
            </h4>
            <p className="text-sm text-gray-600">
              From: {s.source} → To: {s.destination}
            </p>
            <p className="text-sm mt-1">
              Status: <span className="font-semibold text-blue-600">{s.status}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Sender: {s.senderId?.name}</p>
            <p className="text-sm text-gray-500">Transporter: {s.transporterId?.name || 'N/A'}</p>

            <button
              onClick={() => deleteShipment(s._id)}
              className="mt-2 text-red-500 text-sm hover:underline"
            >
              Delete Shipment
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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

export default ShipmentMonitor;

import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10); // ✅ Default to 3 per page

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setUsers(data);
    } else {
      alert('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert('User deleted!');
      fetchUsers();
    } else {
      alert(data.error || 'Failed to delete user');
    }
  };

  // Filter and search
  const filteredUsers = users.filter((u) => {
    const statusMatch =
      statusFilter === 'All' || u.role === statusFilter;
    const searchMatch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Pagination logic
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-xl font-bold">All Users</h3>

        <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search name, email, or role..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border rounded w-full md:w-64"
          />

          <select
            value={statusFilter}
            onChange={handleRoleChange}
            className="p-2 border rounded"
          >
            <option value="All">All Roles</option>
            <option value="sender">User</option>
            <option value="transporter">Transporter</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={usersPerPage}
            onChange={handlePerPageChange}
            className="p-2 border rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <table className="w-full table-auto border border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u._id} className="border-t text-sm">
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.phone}</td>
              <td className="p-2 border text-blue-700 font-semibold">{u.role}</td>
              <td className="p-2 border">
                {u.role !== 'admin' && (
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default UserList;

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const PendingUserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approving, setApproving] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ for spinner while fetching users
  const token = localStorage.getItem('token');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/pending-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPendingUsers(data);
      } else {
        console.error('Error loading users:', data.error);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    setApproving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('User approved successfully');
        fetchPending();
      } else {
        toast.error('Failed to approve user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error approving user');
    } finally {
      setApproving(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pending User Approvals</h2>

      {/* Spinner while loading */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pendingUsers.length === 0 ? (
        <p className="text-gray-500">No pending users.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => approveUser(user._id)}
                    className={`px-3 py-1 rounded text-white ${
                      approving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={approving}
                  >
                    {approving ? 'Approving...' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingUserApproval;

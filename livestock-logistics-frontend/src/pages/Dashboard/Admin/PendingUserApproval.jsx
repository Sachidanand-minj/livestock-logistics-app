// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

// const PendingUserApproval = () => {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [rejectingUserId, setRejectingUserId] = useState(null);
//   const token = localStorage.getItem('token');

//   const fetchPending = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/admin/pending-users', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setPendingUsers(data);
//       } else {
//         toast.error('Failed to fetch users');
//       }
//     } catch (err) {
//       toast.error('Error fetching users');
//     }
//     setLoading(false);
//   };

//   const approveUser = async (id) => {
//     const res = await fetch(`http://localhost:5000/api/admin/users/${id}/approve`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (res.ok) {
//       toast.success('User approved');
//       setPendingUsers(prev => prev.filter(user => user._id !== id)); // ✅ Remove from state
//     } else {
//       toast.error('Approval failed');
//     }
//   };

//   const rejectUser = async (id) => {
//     if (!rejectionReason.trim()) {
//       toast.error('Please provide a reason for rejection');
//       return;
//     }

//     const res = await fetch(`http://localhost:5000/api/admin/users/${id}/reject`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ reason: rejectionReason }),
//     });

//     if (res.ok) {
//       toast.success('User rejected');
//       setPendingUsers(prev => prev.filter(user => user._id !== id)); // ✅ Remove from list
//       setRejectionReason('');
//       setRejectingUserId(null);
//     } else {
//       toast.error('Rejection failed');
//     }
//   };

//   useEffect(() => {
//     fetchPending();
//   }, []);

//   const renderTransporterDetails = (t) => (
//     <>
//       <div className="mt-2">
//         <p><strong>Business Name:</strong> {t.businessName}</p>
//         <p><strong>Business Type:</strong> {t.businessType}</p>
//         <p><strong>Contact Person:</strong> {t.contactPersonName} ({t.contactPersonPhone})</p>
//         <p><strong>Vehicle:</strong> {t.vehicleType} - {t.vehicleNumber}</p>
//         <p><strong>Driver:</strong> {t.driverName}, DL: {t.driverLicenseNumber}</p>
//         <p><strong>PAN:</strong> {t.panNumber}</p>
//         <p><strong>GST:</strong> {t.gstNumber}</p>
//         <p className="mt-1"><strong>Bank:</strong> {t.bankDetails?.bankName}, A/C: {t.bankDetails?.accountNumber}, IFSC: {t.bankDetails?.ifscCode}</p>
//       </div>
//     </>
//   );

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Pending User Approvals</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : pendingUsers.length === 0 ? (
//         <p className="text-gray-600">No pending users.</p>
//       ) : (
//         <div className="grid gap-6">
//           {pendingUsers.map((user) => (
//             <div key={user._id} className="border rounded shadow p-4 bg-white">
//               <p><strong>Name:</strong> {user.name}</p>
//               <p><strong>Email:</strong> {user.email}</p>
//               <p><strong>Phone:</strong> {user.phone}</p>
//               <p><strong>Role:</strong> {user.role}</p>

//               {user.role === 'transporter' && user.transporter && (
//                 <div className="mt-3 border-t pt-2">
//                   <h4 className="font-semibold text-gray-700">Transporter Details:</h4>
//                   {renderTransporterDetails(user.transporter)}
                  
//                 </div>
//               )}

//               <div className="mt-4 flex gap-2">
//                 <button
//                   onClick={() => approveUser(user._id)}
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   Approve
//                 </button>

//                 <button
//                   onClick={() => setRejectingUserId(user._id)}
//                   className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                   Reject
//                 </button>
//               </div>

//               {rejectingUserId === user._id && (
//                 <div className="mt-3">
//                   <textarea
//                     rows="2"
//                     className="w-full p-2 border rounded"
//                     placeholder="Reason for rejection"
//                     value={rejectionReason}
//                     onChange={(e) => setRejectionReason(e.target.value)}
//                   />
//                   <button
//                     onClick={() => rejectUser(user._id)}
//                     className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     Confirm Rejection
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingUserApproval;


import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Base API URL (adjust as needed)
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PendingUserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingUserId, setRejectingUserId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/pending-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPendingUsers(data);
      else toast.error('Failed to fetch users');
    } catch {
      toast.error('Error fetching users');
    }
    setLoading(false);
  };

  const approveUser = async (id) => {
    try {
      const res = await fetch(`${API}/api/admin/users/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('User approved');
        setPendingUsers(prev => prev.filter(u => u._id !== id));
      } else toast.error('Approval failed');
    } catch {
      toast.error('Server error');
    }
  };

  const rejectUser = async (id) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      const res = await fetch(`${API}/api/admin/users/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      if (res.ok) {
        toast.info('User rejected');
        setPendingUsers(prev => prev.filter(u => u._id !== id));
        setRejectionReason('');
        setRejectingUserId(null);
      } else toast.error('Rejection failed');
    } catch {
      toast.error('Server error');
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const renderTransporterDetails = (t) => (
    <>
      <div className="mt-2">
        <p><strong>Business Name:</strong> {t.businessName}</p>
        <p><strong>Business Type:</strong> {t.businessType}</p>
        <p><strong>Contact Person:</strong> {t.contactPersonName} ({t.contactPersonPhone})</p>
        <p><strong>Vehicle:</strong> {t.vehicleType} - {t.vehicleNumber}</p>
        <p><strong>Driver:</strong> {t.driverName}, DL: {t.driverLicenseNumber}</p>
        <p><strong>PAN:</strong> {t.panNumber}</p>
        <p><strong>GST:</strong> {t.gstNumber}</p>
        <p className="mt-1"><strong>Bank:</strong> {t.bankDetails?.bankName}, A/C: {t.bankDetails?.accountNumber}, IFSC: {t.bankDetails?.ifscCode}</p>
      </div>
    </>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pending User Approvals</h2>
      {loading
        ? <p>Loading...</p>
        : pendingUsers.length === 0
          ? <p className="text-gray-600">No pending users.</p>
          : (
            <div className="grid gap-6">
              {pendingUsers.map(user => (
                <div key={user._id} className="border rounded shadow p-4 bg-white">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Role:</strong> {user.role}</p>

                  {user.role === 'transporter' && user.transporter && (
                    <>
                      <div className="mt-3 border-t pt-2">
                        <h4 className="font-semibold text-gray-700">Transporter Details:</h4>
                        {renderTransporterDetails(user.transporter)}

                        {/* View Uploaded Documents */}
                        <div className="mt-4">
                          <h5 className="font-medium">Uploaded Documents:</h5>
                          <ul className="list-disc ml-5 mt-1">
                            {Object.entries(user.transporter.documents).map(([key, path]) =>
                              path ? (
                                <li key={key}>
                                  <a
                                    href={`${API}/${path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </a>
                                </li>
                              ) : null
                            )}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => approveUser(user._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >Approve</button>
                    <button
                      onClick={() => setRejectingUserId(user._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >Reject</button>
                  </div>

                  {rejectingUserId === user._id && (
                    <div className="mt-3">
                      <textarea
                        rows="2"
                        className="w-full p-2 border rounded"
                        placeholder="Reason for rejection"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                      <button
                        onClick={() => rejectUser(user._id)}
                        className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >Confirm Rejection</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
    </div>
  );
};

export default PendingUserApproval;

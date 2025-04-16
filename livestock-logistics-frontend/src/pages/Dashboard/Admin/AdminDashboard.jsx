// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');
// const API_URL = 'http://localhost:5000';

// function AdminDashboard() {
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [shipments, setShipments] = useState([]);
//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);
//   const markersRef = useRef({}); // Track markers by shipmentId
//   const token = localStorage.getItem('token');

//   const fetchAllShipments = async () => {
//     const res = await fetch(`${API_URL}/api/shipment/all`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setShipments(data);
//       if (data.length > 0) {
//         const initial = data.find(s => s.currentLocation?.lat && s.currentLocation?.lng);
//         if (initial) initMap(initial.currentLocation.lat, initial.currentLocation.lng);
//       }
//     }
//   };

//     <div className="flex justify-center mb-4">
//     <select
//         className="p-2 border rounded"
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
//     >
//         <option value="all">All Shipments</option>
//         <option value="Pending">Pending</option>
//         <option value="In Transit">In Transit</option>
//         <option value="Delivered">Delivered</option>
//     </select>
//     </div>


//   const initMap = (lat, lng) => {
//     mapInstance.current = new window.google.maps.Map(mapRef.current, {
//       center: { lat, lng },
//       zoom: 6
//     });

//     // shipments.forEach(shipment => {
//     //   const { lat, lng } = shipment.currentLocation || {};
//     //   if (lat && lng) {
//     //     addOrUpdateMarker(shipment._id, lat, lng, shipment);
//     //   }
//     // });

//     const applyFilter = (list) => {
//         if (statusFilter === 'all') return list;
//         return list.filter(shipment => shipment.status === statusFilter);
//       };
      

//     const filtered = applyFilter(shipments);
//     filtered.forEach(shipment => {
//       const { lat, lng } = shipment.currentLocation || {};
//       if (lat && lng) {
//         addOrUpdateMarker(shipment._id, lat, lng, shipment);
//       }
//     });
//   };

//   const addOrUpdateMarker = (id, lat, lng, shipment) => {
//     const existing = markersRef.current[id];
//     const position = { lat, lng };

//     if (existing) {
//       existing.setPosition(position);
//     } else {
//         const marker = new window.google.maps.Marker({
//             position,
//             map: mapInstance.current,
//             title: shipment.livestockType,
//             icon: getMarkerIcon(shipment.status)
//         });

//       const info = new window.google.maps.InfoWindow({
//         content: `
//           <strong>${shipment.livestockType}</strong><br/>
//           ${shipment.source} → ${shipment.destination}<br/>
//           Status: ${shipment.status}<br/>
//           Qty: ${shipment.quantity}
//         `
//       });

//       const centerMapOnMarker = (shipmentId) => {
//         const marker = markersRef.current[shipmentId];
//         if (marker && mapInstance.current) {
//           mapInstance.current.setCenter(marker.getPosition());
//           mapInstance.current.setZoom(10);
//         }
//       };

//       const getMarkerIcon = (status) => {
//         const baseIcon = {
//           path: window.google.maps.SymbolPath.CIRCLE,
//           scale: 8,
//           fillOpacity: 1,
//           strokeWeight: 1,
//         };
      
//         switch (status) {
//           case 'Delivered':
//             return { ...baseIcon, fillColor: '#16a34a', strokeColor: '#14532d' }; // Green
//           case 'In Transit':
//             return { ...baseIcon, fillColor: '#2563eb', strokeColor: '#1e3a8a' }; // Blue
//           case 'Pending':
//           default:
//             return { ...baseIcon, fillColor: '#f59e0b', strokeColor: '#78350f' }; // Orange
//         }
//       };
      

//       marker.addListener('click', () => info.open(mapInstance.current, marker));
//       markersRef.current[id] = marker;
//     }
//   };

//   const applyFilter = (list) => {
//     if (statusFilter === 'all') return list;
//     return list.filter(shipment => shipment.status === statusFilter);
//   };

//   useEffect(() => {
//     fetchAllShipments();

//     // socket.on('locationUpdated', ({ shipmentId, lat, lng }) => {
//     //   const updated = shipments.find(s => s._id === shipmentId);
//     //   if (updated) {
//     //     addOrUpdateMarker(shipmentId, lat, lng, updated);
//     //   }

//     socket.on('locationUpdated', ({ shipmentId, lat, lng }) => {
//         const updated = shipments.find(s => s._id === shipmentId);
//         if (updated && applyFilter([updated]).length > 0) {
//           addOrUpdateMarker(shipmentId, lat, lng, updated);
//         }
//     });

//     return () => socket.off('locationUpdated');
//   }, [shipments]);

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
//       <div className="flex gap-6 max-w-7xl mx-auto">
//                 {/* Side Panel */}
//                 <div className="w-[350px] bg-white rounded shadow p-4 overflow-y-auto max-h-[600px]">
//                     <h3 className="text-lg font-semibold mb-3">Shipments</h3>
//                     <select
//                         className="w-full mb-4 p-2 border rounded"
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                     >
//                         <option value="all">All Shipments</option>
//                         <option value="Pending">Pending</option>
//                         <option value="In Transit">In Transit</option>
//                         <option value="Delivered">Delivered</option>
//                     </select>

//                     {applyFilter(shipments).map((shipment) => (
//                         <div
//                                 key={shipment._id}
//                                 onClick={() => centerMapOnMarker(shipment._id)}
//                                 className="mb-3 p-2 border rounded cursor-pointer hover:bg-gray-100"
//                                 >
//                                 <p className="font-medium">{shipment.livestockType}</p>
//                                 <p className="text-sm text-gray-600">{shipment.source} → {shipment.destination}</p>
//                                 <p className="text-sm">Qty: {shipment.quantity}</p>
//                                 <p className={`text-xs font-semibold ${
//                                     shipment.status === 'Delivered' ? 'text-green-600' :
//                                     shipment.status === 'In Transit' ? 'text-blue-600' : 'text-orange-500'
//                                 }`}>
//                                     {shipment.status}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//             {/* Map */}
//             <div ref={mapRef} className="flex-1 h-[600px] rounded border" />
//         </div>
//     </div>
//     );
//     }

// export default AdminDashboard;


import React, { useState } from 'react';
import UserList from './UserList';
import ShipmentMonitor from './ShipmentMonitor';

const AdminDashboard = () => {
  const [tab, setTab] = useState('users');

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-white border-r shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <button onClick={() => setTab('users')} className={`w-full text-left ${tab === 'users' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              User List
            </button>
          </li>
          <li>
            <button onClick={() => setTab('shipments')} className={`w-full text-left ${tab === 'shipments' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              Shipment Monitor
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {tab === 'users' && <UserList />}
        {tab === 'shipments' && <ShipmentMonitor />}
      </div>
    </div>
  );
};

export default AdminDashboard;

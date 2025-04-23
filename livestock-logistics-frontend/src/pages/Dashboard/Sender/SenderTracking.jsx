// import React, { useEffect, useState } from 'react';
// import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
// const GOOGLE_MAPS_API_KEY = 'AIzaSyBW98Mn251z5in7weHa7xkx75-cPysttgY';

// const SenderTracking = () => {
//   const [shipments, setShipments] = useState([]);
//   // Filters
//   const [livestockFilter, setLivestockFilter] = useState('All');
//   const [originSearch, setOriginSearch]       = useState('');
//   const [destinationSearch, setDestinationSearch] = useState('');
//   const [dateFrom, setDateFrom]               = useState('');
//   const [dateTo,   setDateTo]                 = useState('');

//   const token    = localStorage.getItem('token');
//   const senderId = localStorage.getItem('userId');
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY
//   });

//   useEffect(() => {
//     const fetchTracking = async () => {
//       try {
//         const res  = await fetch('http://localhost:5000/api/shipment/all', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const data = await res.json();
//         if (res.ok) {
//           const live = data.filter(s =>
//             (s.senderId?._id === senderId || s.senderId === senderId) &&
//             s.status === 'In Transit' &&
//             s.currentLocation
//           );
//           setShipments(live);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchTracking();
//     const iv = setInterval(fetchTracking, 10000);
//     return () => clearInterval(iv);
//   }, [token, senderId]);

//   // Apply filters
//   const filtered = shipments.filter(s => {
//     if (livestockFilter !== 'All' && s.livestockType !== livestockFilter)
//       return false;
//     if (originSearch && !s.source.toLowerCase().includes(originSearch.toLowerCase()))
//       return false;
//     if (destinationSearch && !s.destination.toLowerCase().includes(destinationSearch.toLowerCase()))
//       return false;
//     if (dateFrom && new Date(s.timestamps.startedAt) < new Date(dateFrom)) return false;
//     if (dateTo   && new Date(s.timestamps.startedAt) > new Date(dateTo))   return false;
//     return true;
//   });

//   return (
//     <div className="max-w-5xl mx-auto space-y-4">
//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <select
//           className="p-2 border rounded"
//           value={livestockFilter}
//           onChange={e => setLivestockFilter(e.target.value)}
//         >
//           <option value="All">All Livestock</option>
//           <option value="Cattle">Cattle</option>
//           <option value="Goat">Goat</option>
//           <option value="Poultry">Poultry</option>
//           {/* add more as needed */}
//         </select>
//         <input
//           className="p-2 border rounded"
//           placeholder="Origin"
//           value={originSearch}
//           onChange={e => setOriginSearch(e.target.value)}
//         />
//         <input
//           className="p-2 border rounded"
//           placeholder="Destination"
//           value={destinationSearch}
//           onChange={e => setDestinationSearch(e.target.value)}
//         />
//         <label className="flex items-center">
//           <span className="mr-1">From:</span>
//           <input
//             type="date"
//             className="p-2 border rounded"
//             value={dateFrom}
//             onChange={e => setDateFrom(e.target.value)}
//           />
//         </label>
//         <label className="flex items-center">
//           <span className="mr-1">To:</span>
//           <input
//             type="date"
//             className="p-2 border rounded"
//             value={dateTo}
//             onChange={e => setDateTo(e.target.value)}
//           />
//         </label>
//       </div>

//       {/* Shipment List */}
//       {filtered.length === 0 ? (
//         <p className="text-center text-gray-600">No shipments match your filters.</p>
//       ) : (
//         filtered.map(s => (
//           <div
//             key={s._id}
//             className="bg-white p-4 rounded shadow border-l-4 border-blue-600 flex justify-between items-center"
//           >
//             <div>
//               <h4 className="font-semibold">{s.livestockType} ({s.quantity})</h4>
//               <p className="text-sm text-gray-600">
//                 From: {s.source} → To: {s.destination}
//               </p>
//               <p className="text-sm text-blue-600 mt-1">
//                 📍 Lat {s.currentLocation.lat.toFixed(4)}, Lng {s.currentLocation.lng.toFixed(4)}
//               </p>
//             </div>
//             <button
//               onClick={() => alert('View on Map placeholder')}
//               className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//             >
//               View on Map
//             </button>
//           </div>
//         ))
//       )}
//     </div>
    
//   );
// };

// export default SenderTracking;


// File: src/pages/Dashboard/Sender/SenderTracking.jsx

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBW98Mn251z5in7weHa7xkx75-cPysttgY';

const SenderTracking = () => {
  const [shipments, setShipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalShipment, setModalShipment] = useState(null);

  const token = localStorage.getItem('token');
  const senderId = localStorage.getItem('userId');

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/shipment/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          const live = data.filter(
            (s) =>
              (s.senderId?._id === senderId || s.senderId === senderId) &&
              s.status === 'In Transit' &&
              s.currentLocation
          );
          setShipments(live);
        }
      } catch (err) {
        console.error('Error fetching tracking shipments:', err);
      }
    };

    fetchTracking();
    const iv = setInterval(fetchTracking, 10000); // refresh every 10s
    return () => clearInterval(iv);
  }, [token, senderId]);

  const openMapModal = (shipment) => {
    setModalShipment(shipment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalShipment(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {shipments.length === 0 ? (
        <p className="text-center text-gray-600">No active shipments in transit.</p>
      ) : (
        shipments.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 rounded shadow border-l-4 border-blue-600 flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{s.livestockType} ({s.quantity})</h4>
              <p className="text-sm text-gray-600">
                From: {s.source} → To: {s.destination}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                📍 Lat {s.currentLocation.lat.toFixed(4)}, Lng {s.currentLocation.lng.toFixed(4)}
              </p>
            </div>
            <button
              onClick={() => openMapModal(s)}
              className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              View on Map
            </button>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && modalShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-2xl"
            >
              &times;
            </button>

            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Tracking: {modalShipment.livestockType}</h3>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '400px' }}
                  center={{
                    lat: modalShipment.currentLocation.lat,
                    lng: modalShipment.currentLocation.lng
                  }}
                  zoom={12}
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
                <p>Loading map...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SenderTracking;

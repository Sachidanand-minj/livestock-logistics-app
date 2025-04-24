import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'GOOGLE_MAPS_API_KEY';

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

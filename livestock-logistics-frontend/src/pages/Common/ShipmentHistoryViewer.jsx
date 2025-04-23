import React, { useEffect, useState, useRef } from 'react';

const ShipmentHistoryViewer = ({ shipmentId, onClose }) => {
  const [history, setHistory] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const polyline = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/shipment/${shipmentId}/travel-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setHistory(data);
          if (data.length > 0) initMap(data);
        }
      } catch (err) {
        console.error('Failed to fetch travel history', err);
      }
    };

    fetchHistory();
  }, [shipmentId]);

  const initMap = (data) => {
    const start = data[0];
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: start.lat, lng: start.lng },
      zoom: 10,
    });

    // Start Marker
    new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat: start.lat, lng: start.lng },
      map: mapInstance.current,
      label: 'S',
      title: 'Start Point',
    });

    // End Marker
    const end = data[data.length - 1];
    new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat: end.lat, lng: end.lng },
      map: mapInstance.current,
      label: 'E',
      title: 'End Point',
    });

    const pathCoords = data.map(p => ({ lat: p.lat, lng: p.lng }));
    polyline.current = new window.google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: "#4285F4",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    polyline.current.setMap(mapInstance.current);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Shipment Travel History</h2>
          <button onClick={onClose} className="text-red-500 text-xl">&times;</button>
        </div>

        <div ref={mapRef} className="w-full h-96" />

        <div className="p-4 max-h-56 overflow-y-auto border-t">
          <h4 className="font-semibold mb-2">Travel Timeline:</h4>
          {history.length === 0 ? (
            <p className="text-gray-500">No travel history found.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {history.map((point, idx) => (
                <li key={idx}>
                  🕒 {new Date(point.timestamp).toLocaleString()} – Lat: {point.lat}, Lng: {point.lng}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentHistoryViewer;

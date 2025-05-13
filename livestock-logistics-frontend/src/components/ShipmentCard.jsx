// src/components/ShipmentCard.jsx
import React from 'react';
import ProofUpload from './ProofUpload';

const ShipmentCard = ({ shipment, onStartTracking, onProofUploaded, trackingId }) => {
  const { _id, livestockType, quantity, source, destination, status, proofUploaded, proofVerified, proofPhoto, proofVideo } = shipment;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-200 mb-4">
      <h4 className="text-xl font-semibold mb-1">{livestockType} ({quantity})</h4>
      <p className="text-sm text-gray-600 mb-1">From: <span className="font-medium text-gray-800">{source}</span></p>
      <p className="text-sm text-gray-600 mb-1">To: <span className="font-medium text-gray-800">{destination}</span></p>
      <p className="text-sm mt-1 font-medium text-blue-600">Status: {status}</p>

      {status === 'Confirmed' && (
        <div className="mt-4 space-y-3">
          {/* Upload Proof Section */}
          {!proofUploaded && (
            <ProofUpload
              shipmentId={_id}
              onSuccess={onProofUploaded}
            />
          )}

          {/* Proof uploaded but not yet verified */}
          {proofUploaded && !proofVerified && (
            <p className="text-yellow-600 text-sm">✅ Proof uploaded. Awaiting admin approval.</p>
          )}

          {/* Proof uploaded and verified */}
          {proofUploaded && proofVerified && (
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <img src={proofPhoto} alt="Proof" className="w-24 h-16 object-cover rounded border" />
                <video src={proofVideo} controls className="w-48 h-24 rounded border" />
              </div>

              <button
                onClick={() => onStartTracking(_id)}
                className={`px-4 py-1 rounded text-white ${trackingId === _id ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Start Tracking
              </button>
              {trackingId === _id && (
                <p className="text-sm text-green-600">📍 Live tracking active</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentCard;

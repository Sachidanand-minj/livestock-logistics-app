import React, { useState } from 'react';
import axios from 'axios';

const ProofUpload = ({ shipmentId, onSuccess }) => {
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!photo || !video) {
      alert("Please upload both a photo and a video.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("video", video);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shipment/${shipmentId}/upload-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Proof uploaded successfully.");
      onSuccess(res.data.shipment); // returns updated shipment data
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-sm mb-4 border">
      <h3 className="font-medium mb-2 text-gray-800">Upload Proof Before Journey</h3>

      <label className="block text-sm text-gray-700 mb-1">Photo (e.g. livestock loaded)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        className="mb-3 block w-full"
      />

      <label className="block text-sm text-gray-700 mb-1">Video (short clip)</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
        className="mb-4 block w-full"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-4 py-1 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Upload Proof"}
      </button>
    </div>
  );
};

export default ProofUpload;

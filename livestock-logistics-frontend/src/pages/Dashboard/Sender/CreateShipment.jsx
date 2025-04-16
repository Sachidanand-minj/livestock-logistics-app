import React, { useState } from 'react';

const CreateShipment = () => {
  const [formData, setFormData] = useState({
    livestockType: '',
    quantity: '',
    source: '',
    destination: ''
  });

  const token = localStorage.getItem('token');
  const senderId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/shipment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...formData, receiverId: senderId })
    });

    if (res.ok) {
      alert('Shipment created successfully!');
      setFormData({
        livestockType: '',
        quantity: '',
        source: '',
        destination: ''
      });
    } else {
      alert('Error creating shipment');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Create New Shipment</h3>
      <form onSubmit={handleCreateShipment} className="space-y-4">
        <input name="livestockType" placeholder="Livestock Type" onChange={handleChange} value={formData.livestockType} className="w-full p-2 border rounded" required />
        <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} value={formData.quantity} className="w-full p-2 border rounded" required />
        <input name="source" placeholder="Source Location" onChange={handleChange} value={formData.source} className="w-full p-2 border rounded" required />
        <input name="destination" placeholder="Destination Location" onChange={handleChange} value={formData.destination} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateShipment;

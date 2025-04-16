import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'sender'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/; // Valid Indian mobile number (starts with 6-9, 10 digits)

    if (!phoneRegex.test(formData.phone)) {
    toast.error('Please enter a valid 10-digit Indian phone number');
    return;
    }


    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('userRole', loginData.role);
        toast.success(`Welcome, ${formData.name}! Redirecting to your dashboard...`);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error('Registered but auto-login failed. Please log in manually.');
        navigate('/login');
      }
    } else {
      const data = await res.json();
      toast.error(data.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
        <select name="role" className="w-full p-2 border rounded" onChange={handleChange} value={formData.role}>
            <option value="sender">Sender</option>
            <option value="transporter">Transporter</option>
          </select>
          <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" pattern="[6-9]{1}[0-9]{9}" maxLength="10" className="w-full p-2 border rounded" onChange={handleChange} value={formData.phone} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full p-2 border rounded" onChange={handleChange} required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

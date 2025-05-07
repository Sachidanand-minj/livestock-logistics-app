import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import loginImage from "../../assets/Livestock-transport.jpg";

function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res  = await fetch('https://livestocklogistics.animbiz.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      // Destructure everything your API actually returns
      const { token, role, userId, name, phone, avatar } = data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
      if (phone)  localStorage.setItem('phone', phone);
      if (avatar) localStorage.setItem('avatar', avatar);

      navigate('/dashboard');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      {/* Left - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login to AnimStok</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
        </form>
      </div>
    </div>
    
 
        {/* Right - Image */}
      <div className="w-full md:w-1/2 hidden md:block">
      <img
        src={loginImage}
        alt="Cattle transport"
        className="w-full h-screen object-cover"
      />
    </div>
    </div>
     );
    }
    
export default Login;

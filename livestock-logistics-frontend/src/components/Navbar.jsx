import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Animstok.png';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));
  const [name, setName] = useState(localStorage.getItem('name'));
  const role = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');
  const avatarRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('avatar');
    if (stored) setAvatar(stored);
    else {
      // fallback: fetch /api/user/me
    }
  }, []);


  // Sync avatar & name from localStorage
  useEffect(() => {
    const syncProfile = () => {
      setAvatar(localStorage.getItem('avatar'));
      setName(localStorage.getItem('name'));
    };
    window.addEventListener('storage', syncProfile);
    return () => window.removeEventListener('storage', syncProfile);
  }, []);

  // Fetch avatar on first load
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.avatar) {
          const avatarUrl = `http://localhost:5000${data.avatar}`;
          setAvatar(avatarUrl);
          localStorage.setItem('avatar', avatarUrl);
        }
        if (data.name) {
          setName(data.name);
          localStorage.setItem('name', data.name);
        }
      } catch (err) {
        console.error("Failed to fetch avatar:", err);
      }
    };

    if (token) fetchAvatar();
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('avatar');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow relative">
      <div
        onClick={() => navigate('/')}
        className="cursor-pointer w-fit"
      >
        <img
        src={logo}
        alt="Livestock Logistics Logo"
        className="h-10 w-auto"
      />
      </div>

      <div className="flex items-center space-x-4 relative">
        {token ? (
          <>
            <span className="text-sm text-gray-600 hidden sm:inline">
              Logged in as <strong>{role}</strong>
            </span>
            <div className="relative" ref={avatarRef}>
              <div
                onClick={() => setShowMenu((prev) => !prev)}
                className="cursor-pointer w-10 h-10 rounded-full border-2 border-blue-500 relative"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-300 rounded-full w-full h-full flex items-center justify-center text-white font-bold text-sm">
                    {name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow z-10 py-2">
                  <div className="px-4 py-2 text-gray-700 text-sm">👤 {name}</div>
                  <div className="border-t my-1"></div>
                  <button
                    onClick={() => {
                      navigate('/dashboard?tab=overview');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    📋 Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate('/dashboard?tab=profile');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/login')}
              className={`text-sm font-medium transition-all duration-150 ${
                location.pathname === '/login'
                  ? 'text-white bg-blue-600 px-3 py-1 rounded'
                  : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-1 rounded'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className={`text-sm font-medium transition-all duration-150 ${
                location.pathname === '/register'
                  ? 'text-white bg-blue-600 px-3 py-1 rounded'
                  : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-1 rounded'
              }`}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
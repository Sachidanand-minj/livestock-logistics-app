import React, { useEffect, useState } from 'react';

const SidebarProfile = () => {
  const [role, setRole] = useState('');
  const token = localStorage.getItem('token');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));
  const [name, setName] = useState(localStorage.getItem('name'));

  useEffect(() => {
    const syncAvatar = () => {
      setAvatar(localStorage.getItem('avatar') || '');
    };
    window.addEventListener('storage', syncAvatar);
    return () => window.removeEventListener('storage', syncAvatar);
  }, []);

  
useEffect(() => {
    const syncProfile = () => {
      setAvatar(localStorage.getItem('avatar'));
      setName(localStorage.getItem('name'));
    };
  
    window.addEventListener('storage', syncProfile);
    return () => window.removeEventListener('storage', syncProfile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setRole(localStorage.getItem('userRole') || '');
      setName(localStorage.getItem('name') || '');

      const res = await fetch('https://livestocklogistics.animbiz.com/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.avatar) {
        setAvatar(`https://livestocklogistics.animbiz.com/livestock-logistics-backend${data.avatar}`);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center text-center mb-6">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 mb-2">
        {avatar ? (
          <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gray-300 w-full h-full flex items-center justify-center text-white font-bold text-xl">
            {name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className="text-sm font-semibold">{name || 'User'}</div>
      <div className="text-xs text-gray-500 capitalize">{role}</div>
    </div>
  );
};

export default SidebarProfile;

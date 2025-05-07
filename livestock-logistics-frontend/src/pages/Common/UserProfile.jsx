import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://livestocklogistics.animbiz.com/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        if (data.avatar) {
          const fullUrl = `https://livestocklogistics.animbiz.com/livestock-logistics-backend${data.avatar}`;
          setAvatarPreview(fullUrl);
          localStorage.setItem('avatar', fullUrl);
        }
      } else {
        toast.error(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return toast.error('Please select an image file.');
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const res = await fetch('https://livestocklogistics.animbiz.com/api/user/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.avatar) {
        const avatarUrl = `https://livestocklogistics.animbiz.com/livestock-logistics-backend${data.avatar}`;
        setAvatarPreview(avatarUrl);
        localStorage.setItem('avatar', avatarUrl);
        window.dispatchEvent(new Event('storage'));
        toast.success('Avatar uploaded!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: user.name,
      phone: user.phone
    };
    if (newPassword.trim()) {
      payload.password = newPassword;
    }

    try {
      const res = await fetch('https://livestocklogistics.animbiz.com/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated!');
        localStorage.setItem('name', user.name);
        await fetchProfile();
        setNewPassword('');
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h3 className="text-xl font-bold mb-4">Edit Profile</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block mb-1 font-medium">Profile Picture</label>
        <div className="mb-4">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <button
            type="button"
            onClick={uploadAvatar}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Upload Avatar
          </button>
        </div>

        <input
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          value={user.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          name="phone"
          value={user.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />

        <div className="relative">
          <input
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded pr-10"
            placeholder="New Password (optional)"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;

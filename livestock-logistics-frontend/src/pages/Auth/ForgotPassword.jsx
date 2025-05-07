import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import lockImage from '../../assets/login-left-icon.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://livestocklogistics.animbiz.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        
        {/* Left Section */}
        <div className="flex flex-col justify-center">
          

         <h2 className="text-3xl font-bold mb-2">Forgot your password?</h2>
          <p className="mb-6 text-gray-600">
            Don’t worry, happens to all of us. Enter your email below to recover your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition duration-200"
            >
              Submit
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-green-600 font-medium">
              Password reset link sent to your email.
            </p>
          )}
        </div>

        {/* Right Section with Image */}
        <div className="hidden md:flex w-full h-full items-center justify-center bg-gray-100 rounded-md">
          <img
            src={lockImage}
            alt="Security Visual"
            className="w-full h-full object-contain p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginImage from "../../assets/Livestock-transport.jpg";




function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: 'sender',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Transporter fields
    companyName: '',
    businessType: '',
    panNumber: '',
    gstin: '',
    cin: '',

    contactPerson: '',
    vehicleType: '',
    vehicleNumber: '',
    driverName: '',
    driverLicenseNo: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',

    agreeTerms: false,
    confirmAccuracy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const phoneRegex = /^[6-9]\d{9}$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error('Invalid phone number');
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
        toast.success(`Welcome, ${formData.name}! Redirecting...`);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error('Registered but auto-login failed.');
        navigate('/login');
      }
    } else {
      const data = await res.json();
      toast.error(data.error || 'Registration failed');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Role Selector */}
        <select name="role" onChange={handleChange} value={formData.role} className="w-full p-2 border rounded mb-4">
          <option value="sender">Sender</option>
          <option value="transporter">Transporter</option>
        </select>

        {/* Conditional Form */}
        {formData.role === 'sender' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} value={formData.phone} maxLength="10" pattern="[6-9]{1}[0-9]{9}" className="w-full p-2 border rounded" required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-2 border rounded" required />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            {/* Step-Based Transporter Form */}
            {step === 1 && (
              <>
                <h3 className="text-xl font-semibold mb-4">Step 1: Business Details</h3>
                <input name="companyName" placeholder="Company/Transporter Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="businessType" placeholder="Type of Business" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="panNumber" placeholder="PAN Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="gstin" placeholder="GSTIN" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="cin" placeholder="CIN (if applicable)" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-xl font-semibold mb-4">Step 2: Contact Details</h3>
                <input name="contactPerson" placeholder="Contact Person Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="email" placeholder="Email Address" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="text-xl font-semibold mb-4">Step 3: Vehicle & Driver Details</h3>
                <input name="vehicleType" placeholder="Vehicle Type" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="vehicleNumber" placeholder="Vehicle Reg. Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="driverName" placeholder="Driver Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="driverLicenseNo" placeholder="Driver License No." onChange={handleChange} className="w-full p-2 border rounded mb-2" />
              </>
            )}

             {step === 4 && (
              <>
                 <h3 className="text-xl font-semibold mb-4">Step 4: Legal Documents Upload</h3>

                <div className="space-y-4">
                {/* Upload PAN */}
               <div>
               <label className="block font-medium mb-1">Upload PAN</label>
              <input type="file" className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

             {/* Upload GST Certificate */}
            <div>
             <label className="block font-medium mb-1">Upload GST Certificate</label>
            <input type="file" className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

            {/* Upload Aadhar/ID */}
           <div>
            <label className="block font-medium mb-1">Upload Aadhar/ID</label>
            <input type="file" className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          {/* Upload Company Reg Certificate (optional) */}
         <div>
        <label className="block font-medium mb-1">Upload Company Reg Certificate (Optional)</label>
        <input type="file" className="w-full border border-gray-300 rounded px-3 py-2" />
      </div>

      

      
    </div>
  </>
)}


            {step === 5 && (
              <>
                <h3 className="text-xl font-semibold mb-4">Step 5: Bank Details (Optional)</h3>
                <input name="bankName" placeholder="Bank Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="accountNumber" placeholder="Account Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input name="ifsc" placeholder="IFSC Code" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
              </>
            )}

            {step === 6 && (
              <>
                <h3 className="text-xl font-semibold mb-4">Step 6: Declarations</h3>
                <label className="block mb-2">
                  <input type="checkbox" name="agreeTerms" onChange={handleChange} /> I agree to the terms & privacy policy
                </label>
                <label className="block mb-4">
                  <input type="checkbox" name="confirmAccuracy" onChange={handleChange} /> I confirm all data provided is accurate
                </label>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Submit Registration</button>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>}
              {step < 6 && <button type="button" onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
            </div>
          </form>
        )}
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

export default Register;

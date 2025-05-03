import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginImage from "../../assets/Livestock-transport.jpg";

function Register() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
  const [files, setFiles] = useState({
    gstCertificate: null,
    panCard: null,
    license: null,
    vehicleRc: null,
    insurance: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    setFiles(prev => ({ ...prev, [name]: selected[0] }));
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
    setLoading(true);

    try {
      const data = new FormData();
      // Common fields
      data.append('role', formData.role);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);

      if (formData.role === 'sender') {
        data.append('name', formData.name);
      } else {
        data.append('name', formData.contactPerson);
        data.append('businessName', formData.companyName);
        data.append('businessType', formData.businessType);
        data.append('gstNumber', formData.gstin);
        data.append('panNumber', formData.panNumber);
        data.append('contactPersonName', formData.contactPerson);
        data.append('contactPersonPhone', formData.phone);
        data.append('vehicleType', formData.vehicleType);
        data.append('vehicleNumber', formData.vehicleNumber);
        data.append('driverName', formData.driverName);
        data.append('driverLicenseNumber', formData.driverLicenseNo);
        data.append('accountHolderName', formData.contactPerson);
        data.append('accountNumber', formData.accountNumber);
        data.append('ifscCode', formData.ifsc);
        data.append('bankName', formData.bankName);
        data.append('declarationAccepted', formData.agreeTerms && formData.confirmAccuracy);
        // Attach files
        Object.entries(files).forEach(([key, file]) => {
          if (file) data.append(key, file);
        });
      }

      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Registered successfully. Awaiting admin approval.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          <select name="role" onChange={handleChange} value={formData.role} className="w-full p-2 border rounded mb-4">
            <option value="sender">Sender</option>
            <option value="transporter">Transporter</option>
          </select>

          {formData.role === 'sender' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-2 border rounded" required />
              <button disabled={loading} type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              {/* Step 1: Business Details */}
              {step === 1 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Step 1: Business Details</h3>
                  <input name="companyName" placeholder="Company/Transporter Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="businessType" placeholder="Type of Business" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="panNumber" placeholder="PAN Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="gstin" placeholder="GSTIN" onChange={handleChange} className="w-full p-2	border rounded mb-2" required />
                  <input name="cin" placeholder="CIN (if applicable)" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                </>
              )}

              {/* Step 2: Contact & Login Details */}
              {step === 2 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Step 2: Contact Details</h3>
                  <input name="contactPerson" placeholder="Contact Person Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="email" placeholder="Email Address" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                </>
              )}

              {/* Step 3: Vehicle & Driver Details */}
              {step === 3 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Step 3: Vehicle & Driver Details</h3>
                  <input name="vehicleType" placeholder="Vehicle Type" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="vehicleNumber" placeholder="Vehicle Reg. Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="driverName" placeholder="Driver Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                  <input name="driverLicenseNo" placeholder="Driver License No." onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                </>
              )}

              {/* Step 4: Legal Documents Upload */}
              {step === 4 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Step 4: Legal Documents Upload</h3>
                  <input type="file" name="gstCertificate" onChange={handleFileChange} className="w-full border px-3 py-2 rounded mb-2" required />
                  <input type="file" name="panCard" onChange={handleFileChange} className="w-full border px-3 py-2 rounded mb-2" required />
                  <input type="file" name="license" onChange={handleFileChange} className="w-full border px-3 py-2 rounded mb-2" required />
                  <input type="file" name="vehicleRc" onChange={handleFileChange} className="w-full border px-3 py-2 rounded mb-2" required />
                  <input type="file" name="insurance" onChange={handleFileChange} className="w-full border px-3 py-2 rounded mb-2" required />
                </>
              )}

              {/* Step 5: Bank Details */}
              {step === 5 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Step 5: Bank Details (Optional)</h3>
                  <input name="bankName" placeholder="Bank Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                  <input name="accountNumber" placeholder="Account Number" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                  <input name="ifsc" placeholder="IFSC Code" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                </>
              )}

              {/* Step 6: Declarations */}
              {step === 6 && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Step 6: Declarations</h3>
                  <label className="block mb-2">
                    <input type="checkbox" name="agreeTerms" onChange={handleChange} /> I agree to the terms & policy
                  </label>
                  <label className="block mb-4">
                    <input type="checkbox" name="confirmAccuracy" onChange={handleChange} /> I confirm all data provided is accurate
                  </label>
                  <button disabled={loading} type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                </>
              )}

              <div className="flex justify-between mt-6">
                {step > 1 && <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>}
                {step < 6 && <button type="button" onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="w-full md:w-1/2 hidden md:block">
        <img src={loginImage} alt="Cattle transport" className="w-full h-screen object-cover" />
      </div>
    </div>
  );
}

export default Register;

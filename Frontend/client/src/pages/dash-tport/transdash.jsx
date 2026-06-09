import React, { useState, useMemo, useRef } from "react";
import "./transdash.css"; 


const TransportDashboard = () => {
  const [step, setStep] = useState(1);
  const [otpVerified, setOtpVerified] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [files, setFiles] = useState({
    license: null,
    rc: null,
    insurance: null
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [vals, setVals] = useState({
    fullName: '',
    mobile: '',
    email: '',
    aadhaar: '',
    address: '',
    vehicleNo: '',
    capacity: '',
    district: '',
    state_: ''
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [regId, setRegId] = useState('');

  const otpInputRefs = useRef([]);

  const trustScore = () => {
    let score = 20;
    if (otpVerified) score += 20;
    if (files.license) score += 20;
    if (files.rc) score += 20;
    if (files.insurance) score += 20;
    return score;
  };

  const tsColor = (score) => {
    if (score < 40) return '#e67e22';
    if (score < 80) return '#8fa94a';
    return '#27ae60';
  };

  const tsClass = (score) => {
    if (score < 40) return 'text-orange-500';
    if (score < 80) return 'text-olive-light';
    return 'text-green-600';
  };

  const handleInputChange = (field, value) => {
    setVals(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (key, file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      alert('Invalid file type. Only PDF, JPG, PNG allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5 MB.');
      return;
    }
    setFiles(prev => ({ ...prev, [key]: file.name }));
  };

  const maskAadhaar = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatVehicleNo = (value) => {
    return value.toUpperCase();
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!vals.fullName || vals.fullName.trim().length < 3) {
      newErrors.fullName = 'Enter your full name';
    }
    const mob = (vals.mobile || '').replace(/\s/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(mob)) {
      newErrors.mobile = 'Enter valid 10-digit Indian mobile number';
    }
    if (!vals.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!vals.aadhaar || vals.aadhaar.replace(/\s/g, '').length < 12) {
      newErrors.aadhaar = 'Enter valid 12-digit Aadhaar number';
    }
    if (!vals.address || vals.address.trim().length < 10) {
      newErrors.address = 'Enter your complete address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!vehicleType) newErrors.vehicleType = 'Select vehicle type';
    const vn = (vals.vehicleNo || '').replace(/\s/g, '');
    if (!/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/.test(vn)) {
      newErrors.vehicleNo = 'Enter valid Indian vehicle number (e.g. TN09CD5678)';
    }
    if (!vals.capacity || isNaN(vals.capacity) || vals.capacity <= 0) {
      newErrors.capacity = 'Enter valid capacity in tons';
    }
    if (!fuelType) newErrors.fuelType = 'Select fuel type';
    if (!vals.district || vals.district.trim().length < 2) {
      newErrors.district = 'Enter your base district';
    }
    if (!vals.state_) newErrors.state_ = 'Select your state';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!files.license) newErrors.license = 'Upload driving license';
    if (!files.rc) newErrors.rc = 'Upload RC Book';
    if (!files.insurance) newErrors.insurance = 'Upload vehicle insurance';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    if (step === 2) valid = validateStep2();
    if (valid) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const submitForm = () => {
    if (!validateStep3()) return;
    const newRegId = 'AMV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setRegId(newRegId);
    setSubmitted(true);
  };

  const resetForm = () => {
    setStep(1);
    setOtpVerified(false);
    setVehicleType('');
    setFuelType('');
    setFiles({ license: null, rc: null, insurance: null });
    setErrors({});
    setSubmitted(false);
    setVals({
      fullName: '',
      mobile: '',
      email: '',
      aadhaar: '',
      address: '',
      vehicleNo: '',
      capacity: '',
      district: '',
      state_: ''
    });
    setShowOtpModal(false);
    setOtpCode(['', '', '', '', '', '']);
  };

  const openOtp = () => {
    const mob = vals.mobile.replace(/\s/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(mob)) {
      setErrors({ ...errors, mobile: 'Enter valid mobile number first' });
      return;
    }
    setShowOtpModal(true);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  const confirmOtp = () => {
    const code = otpCode.join('');
    if (code.length === 6) {
      setOtpVerified(true);
      setShowOtpModal(false);
      setOtpCode(['', '', '', '', '', '']);
    } else {
      alert('Please enter all 6 digits.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const vehicleTypes = [
    { key: 'Truck', icon: '🚚' },
    { key: 'Tempo', icon: '🛻' },
    { key: 'Tractor', icon: '🚜' },
    { key: 'Van', icon: '🚐' }
  ];

  const fuels = ['Diesel', 'Petrol', 'CNG', 'Electric'];

  const states = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const score = trustScore();
  const scoreColor = tsColor(score);
  const scoreClass = tsClass(score);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-black h-14 flex items-center justify-between px-8 border-b-2 border-olive">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-olive rounded-md flex items-center justify-center text-white">🚜</div>
            <div>
              <div className="text-white text-sm font-medium">AgriMove</div>
              <div className="text-olive-light text-xs">Agricultural Logistics Platform</div>
            </div>
          </div>
          <div className="border border-olive bg-olive-dark text-olive-pale text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-olive-light rounded-full"></div>
            Secure Portal
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-medium text-black mb-2">Vehicle Registered Successfully</h2>
            <p className="text-sm text-gray-500 mb-6">Your vehicle has been submitted for verification. Our team will review your documents within 24–48 hours.</p>
            <div className="bg-gray-100 border border-gray-200 rounded-lg px-6 py-3 text-lg font-medium text-olive-dark inline-block mb-6 font-mono tracking-wider">
              {regId}
            </div>
            <div className="flex gap-2 justify-center flex-wrap mb-6">
              {otpVerified && (
                <div className="bg-olive-faint text-olive-dark border border-olive-pale rounded-full text-xs px-3 py-1.5 flex items-center gap-1">
                  <span>📱</span> Mobile Verified
                </div>
              )}
              {files.license && (
                <div className="bg-olive-faint text-olive-dark border border-olive-pale rounded-full text-xs px-3 py-1.5 flex items-center gap-1">
                  <span>🪪</span> DL Submitted
                </div>
              )}
              {files.rc && (
                <div className="bg-olive-faint text-olive-dark border border-olive-pale rounded-full text-xs px-3 py-1.5 flex items-center gap-1">
                  <span>📄</span> RC Book Submitted
                </div>
              )}
              {files.insurance && (
                <div className="bg-olive-faint text-olive-dark border border-olive-pale rounded-full text-xs px-3 py-1.5 flex items-center gap-1">
                  <span>🛡️</span> Insurance Submitted
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Trust Score: <strong style={{ color: scoreColor }}>{score}/100</strong>
            </div>
            <button onClick={resetForm} className="bg-olive text-white px-6 py-2 rounded-lg font-medium hover:bg-olive-dark transition">
              + Register Another Vehicle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      <nav className="bg-black h-14 flex items-center justify-between px-8 border-b-2 border-olive">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-olive rounded-md flex items-center justify-center text-white">🚜</div>
          <div>
            <div className="text-white text-sm font-medium">AgriMove</div>
            <div className="text-olive-light text-xs">Agricultural Logistics Platform</div>
          </div>
        </div>
        <div className="border border-olive bg-olive-dark text-olive-pale text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-olive-light rounded-full"></div>
          Secure Portal
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-black rounded-xl p-6 mb-6 border border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="text-white text-xl font-medium flex items-center gap-2">
              <span className="text-olive-light">🚚</span> Vehicle Registration
            </h1>
            <p className="text-gray-400 text-sm mt-1">Complete all steps to register your vehicle on the AgriMove platform</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-3 text-center min-w-[130px]">
            <div className="text-gray-500 text-xs uppercase tracking-wide">Trust Score</div>
            <div className="flex items-center justify-center gap-2">
              <div className={`text-2xl font-medium ${scoreClass}`} style={{ color: scoreColor }}>{score}</div>
              <div className="text-xs text-gray-500">/100</div>
            </div>
            <div className="h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor }}></div>
            </div>
            {score >= 80 && (
              <div className="text-green-600 text-xs mt-1.5 flex items-center justify-center gap-1">
                <span>✓</span> Verified
              </div>
            )}
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-900/20 border border-yellow-800/50 border-l-4 border-l-orange-500 rounded-lg p-3 mb-6 flex items-center gap-2 text-yellow-700 text-sm">
          <span className="text-lg">⚠️</span>
          <span>False information or fraudulent documents will result in <strong>permanent account suspension</strong> and may attract legal action.</span>
        </div>

        {/* Stepper */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex items-center">
          {[
            { step: 1, label: 'Owner Identity', icon: '👤' },
            { step: 2, label: 'Vehicle Details', icon: '🚚' },
            { step: 3, label: 'Documents', icon: '📜' }
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${step > item.step ? 'bg-olive text-white' : 
                    step === item.step ? 'bg-black text-white border-2 border-olive-light' : 
                    'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                  {step > item.step ? '✓' : item.step}
                </div>
                <div className="ml-2">
                  <div className="text-xs text-gray-400 uppercase">Step {item.step}</div>
                  <div className={`text-xs font-medium ${step === item.step ? 'text-black' : step > item.step ? 'text-olive-dark' : 'text-gray-500'}`}>
                    {item.label}
                  </div>
                </div>
              </div>
              {idx < 2 && (
                <div className={`flex-1 h-px mx-2 ${step > item.step ? 'bg-olive' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-olive-faint rounded-lg flex items-center justify-center text-olive-dark">🆔</div>
              <div>
                <div className="font-medium text-black">Owner Identity Verification</div>
                <div className="text-xs text-gray-500">Your identity details are securely stored and encrypted</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Full Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  value={vals.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                  placeholder="Enter your full legal name"
                />
                {errors.fullName && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.fullName}</div>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Mobile Number <span className="text-red-600">*</span></label>
                <div className="relative">
                  <input
                    type="tel"
                    value={vals.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none w-full pr-20"
                    placeholder="+91 XXXXX XXXXX"
                  />
                  <button
                    onClick={openOtp}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-olive text-white px-3 py-1 rounded text-xs hover:bg-olive-dark transition"
                  >
                    {otpVerified ? '✓ Done' : 'Send OTP'}
                  </button>
                </div>
                {otpVerified && <div className="text-xs text-green-600 flex items-center gap-1">✓ Mobile verified</div>}
                {errors.mobile && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.mobile}</div>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Email Address <span className="text-red-600">*</span></label>
                <input
                  type="email"
                  value={vals.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                  placeholder="owner@example.com"
                />
                {errors.email && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.email}</div>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Aadhaar Number <span className="text-red-600">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={14}
                    value={maskAadhaar(vals.aadhaar)}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value.replace(/\D/g, ''))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none w-full"
                    placeholder="XXXX XXXX XXXX"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔒</span>
                </div>
                <div className="text-xs text-gray-400">🔒 Masked — last 4 digits stored only</div>
                {errors.aadhaar && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.aadhaar}</div>}
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Address <span className="text-red-600">*</span></label>
                <textarea
                  rows={2}
                  value={vals.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                  placeholder="Enter full address with pincode"
                ></textarea>
                {errors.address && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.address}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-olive-faint rounded-lg flex items-center justify-center text-olive-dark">🚚</div>
              <div>
                <div className="font-medium text-black">Vehicle Details</div>
                <div className="text-xs text-gray-500">Enter the vehicle information as per the RC Book</div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-600 font-medium mb-2">Vehicle Type <span className="text-red-600">*</span></label>
              <div className="flex gap-2 flex-wrap">
                {vehicleTypes.map(type => (
                  <div
                    key={type.key}
                    onClick={() => setVehicleType(type.key)}
                    className={`flex-1 min-w-[80px] border rounded-lg px-3 py-2 text-center cursor-pointer transition text-sm
                      ${vehicleType === type.key ? 'border-olive bg-olive-faint text-olive-dark font-medium' : 'border-gray-200 text-gray-600 hover:border-olive-light'}`}
                  >
                    <div className="text-xl">{type.icon}</div>
                    <div>{type.key}</div>
                  </div>
                ))}
              </div>
              {errors.vehicleType && <div className="text-xs text-red-600 flex items-center gap-1 mt-1">⚠️ {errors.vehicleType}</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Vehicle Number <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  value={formatVehicleNo(vals.vehicleNo)}
                  onChange={(e) => handleInputChange('vehicleNo', e.target.value.toUpperCase())}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                  placeholder="MH 01 AB 1234"
                />
                <div className="text-xs text-gray-400">Format: STATE CODE · DISTRICT · SERIES · NUMBER (e.g. TN 09 CD 5678)</div>
                {errors.vehicleNo && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.vehicleNo}</div>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Load Capacity (Tons) <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  value={vals.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                  placeholder="e.g. 5"
                  min="0.5"
                  max="40"
                  step="0.5"
                />
                {errors.capacity && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.capacity}</div>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Fuel Type <span className="text-red-600">*</span></label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                >
                  <option value="">Select fuel type</option>
                  {fuels.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.fuelType && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.fuelType}</div>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Current Base District <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  value={vals.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                  placeholder="e.g. Erode"
                />
                {errors.district && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.district}</div>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">State <span className="text-red-600">*</span></label>
                <select
                  value={vals.state_}
                  onChange={(e) => handleInputChange('state_', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                >
                  <option value="">Select state</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state_ && <div className="text-xs text-red-600 flex items-center gap-1">⚠️ {errors.state_}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-olive-faint rounded-lg flex items-center justify-center text-olive-dark">📜</div>
              <div>
                <div className="font-medium text-black">Verification Documents</div>
                <div className="text-xs text-gray-500">Upload clear scans or photos. Accepted: PDF, JPG, PNG (max 5 MB each)</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'license', label: 'Driving License', icon: '🪪', hint: 'Front side, clear scan' },
                { key: 'rc', label: 'RC Book', icon: '📄', hint: 'Registration certificate' },
                { key: 'insurance', label: 'Vehicle Insurance', icon: '🛡️', hint: 'Valid policy document' }
              ].map(doc => (
                <div key={doc.key} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600 font-medium flex items-center gap-1">{doc.icon} {doc.label} <span className="text-red-600">*</span></label>
                  <div
                    onClick={() => document.getElementById(`file_${doc.key}`).click()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition
                      ${files[doc.key] ? 'border-olive bg-olive-faint' : 'border-gray-300 hover:border-olive'}`}
                  >
                    <input
                      type="file"
                      id={`file_${doc.key}`}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                    />
                    <div className="text-2xl">{files[doc.key] ? '✓' : '📤'}</div>
                    <div className="text-sm font-medium text-gray-700">{files[doc.key] || 'Click to upload'}</div>
                    <div className="text-xs text-gray-400">{doc.hint}</div>
                    {files[doc.key] && (
                      <div className="mt-2 text-xs text-olive-dark bg-white/50 inline-block px-2 py-0.5 rounded-full">
                        ✓ Uploaded
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded-lg border-l-4 border-olive">
              <div className="text-xs font-medium text-gray-700 mb-2">📋 Document Checklist</div>
              <div className="grid grid-cols-3 gap-2">
                {['license', 'rc', 'insurance'].map(k => (
                  <div key={k} className={`flex items-center gap-1 text-xs ${files[k] ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{files[k] ? '✓' : '○'}</span>
                    <span>{k === 'license' ? 'Driving License' : k === 'rc' ? 'RC Book' : 'Insurance'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            {step > 1 && (
              <button onClick={prevStep} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-1">
                ← Back
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Step <strong>{step}</strong> of 3
          </div>
          <div>
            {step < 3 ? (
              <button onClick={nextStep} className="bg-olive text-white px-6 py-2 rounded-lg font-medium hover:bg-olive-dark transition flex items-center gap-1">
                Continue →
              </button>
            ) : (
              <button onClick={submitForm} className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-1">
                ✉ Submit Registration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 w-[380px]">
            <h3 className="text-base font-medium mb-2 flex items-center gap-1">
              <span className="text-olive">📱</span> OTP Verification
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the 6-digit code sent to your mobile number ending with {vals.mobile.slice(-4)}
            </p>
            <div className="flex gap-2 justify-center mb-4">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpInputRefs.current[idx] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-xl font-medium focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none"
                />
              ))}
            </div>
            <button onClick={confirmOtp} className="w-full bg-olive text-white py-2 rounded-lg font-medium hover:bg-olive-dark transition">
              Verify OTP
            </button>
            <div className="text-center mt-3">
              <button onClick={() => alert('Resend OTP triggered (demo)')} className="text-olive text-sm hover:underline">
                Didn't receive it? Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportDashboard;
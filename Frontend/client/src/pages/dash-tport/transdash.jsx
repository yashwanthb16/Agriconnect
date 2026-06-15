import React, { useState, useRef, useEffect } from 'react';

const TransportDashboard = () => {
  // ========== STEP MANAGEMENT ==========
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');
  
  // ========== OTP STATE ==========
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const otpInputRefs = useRef([]);
  
  // ========== DECLARATION STATE ==========
  const [criminalDeclaration, setCriminalDeclaration] = useState(null);
  const [tosAccepted, setTosAccepted] = useState(false);
  
  // ========== DRIVER PROFILE FIELDS ==========
  const [driverProfile, setDriverProfile] = useState({
    // Basic Info
    fullName: '',
    dateOfBirth: '',
    gender: '',
    mobile: '',
    email: '',
    permanentAddress: '',
    currentAddress: '',
    nationalId: '', // Aadhaar or PAN
    nationalIdType: 'aadhaar', // aadhaar or pan
    
    // Licensing
    licenseNumber: '',
    licenseIssuingRTO: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    licenseClass: '',
    drivingExperienceYears: '',
    
    // Declaration
    criminalHistory: false,
    criminalDetails: '',
    medicalFitnessCertificateDate: '',
    medicalFitnessUpload: null,
    
    // Profile Photo
    profilePhoto: null,
  });
  
  // ========== VEHICLE DETAILS ==========
  const [vehicleDetails, setVehicleDetails] = useState({
    // Basic Specs
    vehicleType: '',
    make: '',
    model: '',
    yearOfManufacture: '',
    color: '',
    seatingCapacity: '',
    fuelType: '',
    registrationNumber: '',
    vinChassis: '',
    
    // Documentation
    rcNumber: '',
    rcIssueDate: '',
    rcIssuingRTO: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
    pucCertificateNumber: '',
    pucExpiryDate: '',
    certificateOfFitnessNumber: '',
    certificateOfFitnessExpiry: '',
    permitNumber: '',
    permitType: '',
    permitExpiryDate: '',
    taxTokenPaid: false,
    noUnpaidFines: false,
  });
  
  // ========== UPLOADED FILES ==========
  const [uploadedFiles, setUploadedFiles] = useState({
    driverLicenseFront: null,
    driverLicenseBack: null,
    identityProof: null,
    profilePhoto: null,
    vehicleRC: null,
    insuranceCertificate: null,
    pucCertificate: null,
    fitnessCertificate: null,
    permitCertificate: null,
    medicalFitness: null,
  });
  
  // ========== BANK DETAILS ==========
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });
  
  // ========== ERRORS ==========
  const [errors, setErrors] = useState({});
  
  const otpInputRefsEmail = useRef([]);

  // ========== HELPER FUNCTIONS ==========
  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const calculateExperience = (licenseIssueDate) => {
    if (!licenseIssueDate) return 0;
    const issueDate = new Date(licenseIssueDate);
    const today = new Date();
    let years = today.getFullYear() - issueDate.getFullYear();
    const m = today.getMonth() - issueDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < issueDate.getDate())) {
      years--;
    }
    return years;
  };
  
  const getVehicleAge = (manufactureYear) => {
    if (!manufactureYear) return 0;
    const currentYear = new Date().getFullYear();
    return currentYear - parseInt(manufactureYear);
  };

  // ========== VALIDATION FUNCTIONS ==========
  const validateStep1 = () => {
    const newErrors = {};
    
    // Basic Info
    if (!driverProfile.fullName?.trim()) newErrors.fullName = 'Full name required';
    if (!driverProfile.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth required';
    } else if (calculateAge(driverProfile.dateOfBirth) < 21) {
      newErrors.dateOfBirth = 'Driver must be at least 21 years old';
    }
    
    // Contact
    const mob = (driverProfile.mobile || '').replace(/\s/g, '');
    if (!/^[6-9]\d{9}$/.test(mob)) newErrors.mobile = 'Valid 10-digit mobile number required';
    if (!mobileVerified) newErrors.mobileVerified = 'Please verify your mobile number with OTP';
    
    if (!driverProfile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverProfile.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!emailVerified) newErrors.emailVerified = 'Please verify your email address';
    
    // Addresses
    if (!driverProfile.permanentAddress?.trim()) newErrors.permanentAddress = 'Permanent address required';
    if (!driverProfile.currentAddress?.trim()) newErrors.currentAddress = 'Current address required';
    
    // National ID
    if (!driverProfile.nationalId?.trim()) newErrors.nationalId = `${driverProfile.nationalIdType === 'aadhaar' ? 'Aadhaar' : 'PAN'} number required`;
    if (driverProfile.nationalIdType === 'aadhaar' && driverProfile.nationalId.replace(/\D/g, '').length !== 12) {
      newErrors.nationalId = 'Aadhaar must be 12 digits';
    }
    
    // Bank Details
    if (!bankDetails.accountHolderName?.trim()) newErrors.accountHolderName = 'Account holder name required';
    if (!bankDetails.accountNumber?.trim()) newErrors.accountNumber = 'Account number required';
    if (!bankDetails.ifscCode?.trim()) newErrors.ifscCode = 'IFSC code required';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    // Licensing
    if (!driverProfile.licenseNumber?.trim()) newErrors.licenseNumber = 'License number required';
    if (!driverProfile.licenseIssuingRTO?.trim()) newErrors.licenseIssuingRTO = 'Issuing RTO required';
    if (!driverProfile.licenseIssueDate) newErrors.licenseIssueDate = 'License issue date required';
    if (!driverProfile.licenseExpiryDate) newErrors.licenseExpiryDate = 'License expiry date required';
    
    const experience = calculateExperience(driverProfile.licenseIssueDate);
    if (experience < 2) newErrors.experience = 'Minimum 2 years driving experience required';
    driverProfile.drivingExperienceYears = experience;
    
    if (!driverProfile.licenseClass) newErrors.licenseClass = 'License class/type required';
    
    // Medical Fitness
    if (!driverProfile.medicalFitnessCertificateDate) newErrors.medicalFitnessCertificateDate = 'Medical fitness certificate date required';
    if (!uploadedFiles.medicalFitness) newErrors.medicalFitness = 'Medical fitness certificate upload required';
    
    // Profile Photo
    if (!uploadedFiles.profilePhoto) newErrors.profilePhoto = 'Profile photo required';
    
    // Criminal Declaration
    if (criminalDeclaration === null) newErrors.criminalDeclaration = 'Please declare any criminal history';
    if (criminalDeclaration === true && !driverProfile.criminalDetails?.trim()) {
      newErrors.criminalDetails = 'Please provide details of criminal history';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors = {};
    
    // Vehicle Basic Specs
    if (!vehicleDetails.vehicleType) newErrors.vehicleType = 'Vehicle type required';
    if (!vehicleDetails.make?.trim()) newErrors.make = 'Make/Brand required';
    if (!vehicleDetails.model?.trim()) newErrors.model = 'Model required';
    if (!vehicleDetails.yearOfManufacture) {
      newErrors.yearOfManufacture = 'Year of manufacture required';
    } else if (getVehicleAge(vehicleDetails.yearOfManufacture) > 8) {
      newErrors.yearOfManufacture = 'Vehicle cannot be older than 8 years';
    }
    if (!vehicleDetails.color?.trim()) newErrors.color = 'Color required';
    if (!vehicleDetails.seatingCapacity) newErrors.seatingCapacity = 'Seating capacity required';
    if (!vehicleDetails.fuelType) newErrors.fuelType = 'Fuel type required';
    if (!vehicleDetails.registrationNumber?.trim()) newErrors.registrationNumber = 'Registration number required';
    if (!vehicleDetails.vinChassis?.trim()) newErrors.vinChassis = 'VIN/Chassis number required';
    
    // RC Details
    if (!vehicleDetails.rcNumber?.trim()) newErrors.rcNumber = 'RC number required';
    if (!vehicleDetails.rcIssueDate) newErrors.rcIssueDate = 'RC issue date required';
    if (!vehicleDetails.rcIssuingRTO?.trim()) newErrors.rcIssuingRTO = 'RC issuing RTO required';
    
    // Insurance
    if (!vehicleDetails.insurancePolicyNumber?.trim()) newErrors.insurancePolicyNumber = 'Insurance policy number required';
    if (!vehicleDetails.insuranceExpiryDate) newErrors.insuranceExpiryDate = 'Insurance expiry date required';
    
    // PUC
    if (!vehicleDetails.pucCertificateNumber?.trim()) newErrors.pucCertificateNumber = 'PUC certificate number required';
    if (!vehicleDetails.pucExpiryDate) newErrors.pucExpiryDate = 'PUC expiry date required';
    
    // Fitness Certificate (if applicable)
    if (vehicleDetails.vehicleType === 'taxi' || vehicleDetails.vehicleType === 'auto') {
      if (!vehicleDetails.certificateOfFitnessNumber?.trim()) newErrors.certificateOfFitnessNumber = 'Fitness certificate number required';
      if (!vehicleDetails.certificateOfFitnessExpiry) newErrors.certificateOfFitnessExpiry = 'Fitness certificate expiry required';
    }
    
    // Permit (if applicable)
    if (vehicleDetails.vehicleType === 'taxi') {
      if (!vehicleDetails.permitNumber?.trim()) newErrors.permitNumber = 'Permit number required';
      if (!vehicleDetails.permitType) newErrors.permitType = 'Permit type required';
      if (!vehicleDetails.permitExpiryDate) newErrors.permitExpiryDate = 'Permit expiry date required';
    }
    
    // Tax & Fines Declaration
    if (!vehicleDetails.taxTokenPaid) newErrors.taxTokenPaid = 'Please confirm tax token is paid';
    if (!vehicleDetails.noUnpaidFines) newErrors.noUnpaidFines = 'Please confirm no unpaid fines';
    
    // Document Uploads
    if (!uploadedFiles.vehicleRC) newErrors.vehicleRC = 'Vehicle RC upload required';
    if (!uploadedFiles.insuranceCertificate) newErrors.insuranceCertificate = 'Insurance certificate upload required';
    if (!uploadedFiles.pucCertificate) newErrors.pucCertificate = 'PUC certificate upload required';
    if ((vehicleDetails.vehicleType === 'taxi' || vehicleDetails.vehicleType === 'auto') && !uploadedFiles.fitnessCertificate) {
      newErrors.fitnessCertificate = 'Fitness certificate upload required';
    }
    if (vehicleDetails.vehicleType === 'taxi' && !uploadedFiles.permitCertificate) {
      newErrors.permitCertificate = 'Permit certificate upload required';
    }
    
    // Terms
    if (!tosAccepted) newErrors.tosAccepted = 'You must accept Terms of Service';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // ========== NAVIGATION ==========
  const nextStep = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    if (step === 2) valid = validateStep2();
    if (step === 3) valid = validateStep3();
    if (valid && step < 4) {
      setStep(step + 1);
      setErrors({});
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };
  
  const submitForm = () => {
    if (!validateStep3()) return;
    const newRegId = 'DRV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setRegId(newRegId);
    setSubmitted(true);
  };
  
  const resetForm = () => {
    setStep(1);
    setSubmitted(false);
    setMobileVerified(false);
    setEmailVerified(false);
    setCriminalDeclaration(null);
    setTosAccepted(false);
    setDriverProfile({
      fullName: '', dateOfBirth: '', gender: '', mobile: '', email: '',
      permanentAddress: '', currentAddress: '', nationalId: '', nationalIdType: 'aadhaar',
      licenseNumber: '', licenseIssuingRTO: '', licenseIssueDate: '', licenseExpiryDate: '',
      licenseClass: '', drivingExperienceYears: '', criminalHistory: false, criminalDetails: '',
      medicalFitnessCertificateDate: '', medicalFitnessUpload: null, profilePhoto: null,
    });
    setVehicleDetails({
      vehicleType: '', make: '', model: '', yearOfManufacture: '', color: '',
      seatingCapacity: '', fuelType: '', registrationNumber: '', vinChassis: '',
      rcNumber: '', rcIssueDate: '', rcIssuingRTO: '', insurancePolicyNumber: '',
      insuranceExpiryDate: '', pucCertificateNumber: '', pucExpiryDate: '',
      certificateOfFitnessNumber: '', certificateOfFitnessExpiry: '', permitNumber: '',
      permitType: '', permitExpiryDate: '', taxTokenPaid: false, noUnpaidFines: false,
    });
    setUploadedFiles({
      driverLicenseFront: null, driverLicenseBack: null, identityProof: null,
      profilePhoto: null, vehicleRC: null, insuranceCertificate: null,
      pucCertificate: null, fitnessCertificate: null, permitCertificate: null,
      medicalFitness: null,
    });
    setBankDetails({ accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '' });
    setOtpCode(['', '', '', '', '', '']);
    setShowOtpModal(false);
  };
  
  // ========== OTP FUNCTIONS ==========
  const openMobileOtpModal = () => {
    const mob = driverProfile.mobile.replace(/\s/g, '');
    if (!/^[6-9]\d{9}$/.test(mob)) {
      setErrors(prev => ({ ...prev, mobile: 'Enter valid mobile number first' }));
      return;
    }
    setOtpCode(['', '', '', '', '', '']);
    setShowOtpModal(true);
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
  };
  
  const openEmailOtpModal = () => {
    if (!driverProfile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverProfile.email)) {
      setErrors(prev => ({ ...prev, email: 'Enter valid email first' }));
      return;
    }
    setEmailOtpSent(true);
    setOtpCode(['', '', '', '', '', '']);
    alert(`Demo: OTP sent to ${driverProfile.email}`);
  };
  
  const confirmMobileOtp = () => {
    const code = otpCode.join('');
    if (code.length === 6) {
      setMobileVerified(true);
      setShowOtpModal(false);
    } else {
      alert('Please enter all 6 digits');
    }
  };
  
  const confirmEmailOtp = () => {
    const code = otpCode.join('');
    if (code.length === 6) {
      setEmailVerified(true);
      setEmailOtpSent(false);
    } else {
      alert('Please enter all 6 digits');
    }
  };
  
  const handleOtpChange = (index, value, isEmail = false) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value && index < 5) {
      if (isEmail && otpInputRefsEmail.current[index + 1]) {
        otpInputRefsEmail.current[index + 1]?.focus();
      } else if (!isEmail && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleFileUpload = (key, file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      alert('Invalid file type. Only PDF, JPG, PNG allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5 MB.');
      return;
    }
    setUploadedFiles(prev => ({ ...prev, [key]: file.name }));
  };
  
  // ========== DATA OPTIONS ==========
  const vehicleTypes = ['motorcycle', 'auto', 'taxi', 'car', 'e-rickshaw'];
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
  const licenseClasses = ['LMV', 'MCWG', 'HMV', 'MCWOG', 'LMV-NT'];
  const permitTypes = ['All India Tourist Permit', 'State Permit', 'City Permit', 'EV Permit'];
  
  // ========== RENDER HELPERS ==========
  const renderField = (label, field, type = 'text', required = true, options = null) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {options ? (
          <select
            value={driverProfile[field] || vehicleDetails[field] || ''}
            onChange={(e) => {
              if (field in driverProfile) setDriverProfile(prev => ({ ...prev, [field]: e.target.value }));
              else setVehicleDetails(prev => ({ ...prev, [field]: e.target.value }));
            }}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={driverProfile[field] || vehicleDetails[field] || bankDetails[field] || ''}
            onChange={(e) => {
              if (field in driverProfile) setDriverProfile(prev => ({ ...prev, [field]: e.target.value }));
              else if (field in vehicleDetails) setVehicleDetails(prev => ({ ...prev, [field]: e.target.value }));
              else setBankDetails(prev => ({ ...prev, [field]: e.target.value }));
            }}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        {errors[field] && <div className="text-xs text-red-500">⚠️ {errors[field]}</div>}
      </div>
    );
  };
  
  // Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <nav className="bg-slate-900 h-14 flex items-center justify-between px-6 border-b-2 border-teal-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white">🚕</div>
            <div><div className="text-white text-sm font-semibold">AgriMove Driver</div></div>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-emerald-600">✓</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
            <p className="text-gray-500 text-sm mb-6">Your driver registration is under review. We'll verify your documents and get back to you within 48-72 hours.</p>
            <div className="bg-slate-100 rounded-xl px-6 py-3 text-lg font-mono font-semibold text-teal-700 inline-block mb-6">
              {regId}
            </div>
            <button onClick={resetForm} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-teal-700">
              Register New Driver
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <nav className="bg-slate-900 h-14 flex items-center justify-between px-6 border-b-2 border-teal-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white">🚕</div>
          <div><div className="text-white text-sm font-semibold">AgriMove Driver Onboarding</div></div>
        </div>
        <div className="border border-teal-700 bg-slate-800 text-teal-300 text-xs px-3 py-1.5 rounded-full">Secure Portal</div>
      </nav>
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="bg-white rounded-xl p-4 mb-6 flex items-center">
          {[{step:1, label:'Profile & KYC'},{step:2, label:'License & Background'},{step:3, label:'Vehicle & Docs'},{step:4, label:'Review'},{step:5, label:'Submit'}].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step > item.step ? 'bg-teal-600 text-white' : step === item.step ? 'bg-slate-800 text-white ring-2 ring-teal-400' : 'bg-gray-200 text-gray-500'}`}>
                  {step > item.step ? '✓' : item.step}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className="text-[10px] text-gray-400">Step {item.step}</div>
                  <div className="text-xs font-medium">{item.label}</div>
                </div>
              </div>
              {idx < 4 && <div className={`flex-1 h-px mx-1 ${step > item.step ? 'bg-teal-500' : 'bg-gray-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>
        
        {/* Step 1: Profile & KYC */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="font-semibold text-slate-800">👤 Driver Profile & KYC</h3>
              <p className="text-xs text-gray-500">Basic information, contact details, and bank account</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderField('Full Name (as per ID)', 'fullName', 'text', true)}
                {renderField('Date of Birth', 'dateOfBirth', 'date', true)}
                {renderField('Gender', 'gender', 'text', false, null)}
                
                {/* Mobile with OTP */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="tel" value={driverProfile.mobile} onChange={(e) => setDriverProfile(prev => ({...prev, mobile: e.target.value}))} className="border rounded-xl px-4 py-2.5 text-sm w-full pr-24" placeholder="10-digit mobile" />
                    <button onClick={openMobileOtpModal} className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs">
                      {mobileVerified ? '✓ Verified' : 'Verify OTP'}
                    </button>
                  </div>
                  {mobileVerified && <div className="text-xs text-emerald-600">✓ Mobile verified</div>}
                  {errors.mobile && <div className="text-xs text-red-500">⚠️ {errors.mobile}</div>}
                  {errors.mobileVerified && <div className="text-xs text-red-500">⚠️ {errors.mobileVerified}</div>}
                </div>
                
                {/* Email with verification */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="email" value={driverProfile.email} onChange={(e) => setDriverProfile(prev => ({...prev, email: e.target.value}))} className="border rounded-xl px-4 py-2.5 text-sm w-full pr-24" placeholder="driver@example.com" />
                    <button onClick={openEmailOtpModal} className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs">
                      {emailVerified ? '✓ Verified' : 'Verify'}
                    </button>
                  </div>
                  {emailVerified && <div className="text-xs text-emerald-600">✓ Email verified</div>}
                  {errors.email && <div className="text-xs text-red-500">⚠️ {errors.email}</div>}
                  {errors.emailVerified && <div className="text-xs text-red-500">⚠️ {errors.emailVerified}</div>}
                </div>
                
                {renderField('Permanent Address', 'permanentAddress', 'text', true)}
                {renderField('Current Address', 'currentAddress', 'text', true)}
                
                {/* National ID with type selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">ID Type <span className="text-red-500">*</span></label>
                  <select value={driverProfile.nationalIdType} onChange={(e) => setDriverProfile(prev => ({...prev, nationalIdType: e.target.value}))} className="border rounded-xl px-4 py-2.5 text-sm">
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                  </select>
                </div>
                {renderField(driverProfile.nationalIdType === 'aadhaar' ? 'Aadhaar Number' : 'PAN Number', 'nationalId', 'text', true)}
                
                {/* Bank Details Section */}
                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h4 className="font-medium text-slate-700 mb-3">🏦 Bank Account Details (for Payouts)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {renderField('Account Holder Name', 'accountHolderName', 'text', true)}
                    {renderField('Account Number', 'accountNumber', 'text', true)}
                    {renderField('IFSC Code', 'ifscCode', 'text', true)}
                    {renderField('Bank Name', 'bankName', 'text', false)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Licensing & Background */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="font-semibold text-slate-800">📜 License & Background Verification</h3>
              <p className="text-xs text-gray-500">Driving license, medical fitness, and declaration</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderField('Driving License Number', 'licenseNumber', 'text', true)}
                {renderField('Issuing RTO/Authority', 'licenseIssuingRTO', 'text', true)}
                {renderField('License Issue Date', 'licenseIssueDate', 'date', true)}
                {renderField('License Expiry Date', 'licenseExpiryDate', 'date', true)}
                {renderField('License Class/Type', 'licenseClass', 'text', true, licenseClasses)}
                
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold">📊 Calculated Experience</div>
                  <div className="text-2xl font-bold text-teal-600">{calculateExperience(driverProfile.licenseIssueDate)} years</div>
                  <div className="text-xs text-gray-500">Minimum 2 years required</div>
                  {errors.experience && <div className="text-xs text-red-500 mt-1">⚠️ {errors.experience}</div>}
                </div>
                
                {/* Medical Fitness */}
                {renderField('Medical Fitness Certificate Date', 'medicalFitnessCertificateDate', 'date', true)}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold">Medical Fitness Upload <span className="text-red-500">*</span></label>
                  <div onClick={() => document.getElementById('medicalFitness').click()} className="border-2 border-dashed rounded-xl p-3 text-center cursor-pointer">
                    <input type="file" id="medicalFitness" className="hidden" onChange={(e) => handleFileUpload('medicalFitness', e.target.files[0])} />
                    <div>{uploadedFiles.medicalFitness ? '✅ ' + uploadedFiles.medicalFitness : '📄 Click to upload'}</div>
                  </div>
                  {errors.medicalFitness && <div className="text-xs text-red-500">⚠️ {errors.medicalFitness}</div>}
                </div>
                
                {/* Profile Photo */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold">Passport-style Photo <span className="text-red-500">*</span></label>
                  <div onClick={() => document.getElementById('profilePhoto').click()} className="border-2 border-dashed rounded-xl p-3 text-center cursor-pointer">
                    <input type="file" id="profilePhoto" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('profilePhoto', e.target.files[0])} />
                    <div>{uploadedFiles.profilePhoto ? '✅ ' + uploadedFiles.profilePhoto : '📷 Click to upload photo'}</div>
                  </div>
                  {errors.profilePhoto && <div className="text-xs text-red-500">⚠️ {errors.profilePhoto}</div>}
                </div>
                
                {/* Criminal History Declaration */}
                <div className="md:col-span-2 border-t pt-4">
                  <label className="text-xs font-semibold">Criminal History Declaration <span className="text-red-500">*</span></label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2"><input type="radio" name="criminal" onChange={() => { setCriminalDeclaration(false); setDriverProfile(prev => ({...prev, criminalHistory: false})); }} /> No criminal history</label>
                    <label className="flex items-center gap-2"><input type="radio" name="criminal" onChange={() => { setCriminalDeclaration(true); setDriverProfile(prev => ({...prev, criminalHistory: true})); }} /> I have criminal history</label>
                  </div>
                  {errors.criminalDeclaration && <div className="text-xs text-red-500">⚠️ {errors.criminalDeclaration}</div>}
                  {criminalDeclaration === true && (
                    <textarea rows={2} className="border rounded-xl p-3 text-sm w-full mt-2" placeholder="Please provide details of convictions/pending cases..." value={driverProfile.criminalDetails} onChange={(e) => setDriverProfile(prev => ({...prev, criminalDetails: e.target.value}))} />
                  )}
                  {errors.criminalDetails && <div className="text-xs text-red-500">⚠️ {errors.criminalDetails}</div>}
                </div>
                
                {/* License Uploads */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div><label className="text-xs font-semibold">Driving License (Front) <span className="text-red-500">*</span></label>
                    <div onClick={() => document.getElementById('dlFront').click()} className="border-2 border-dashed rounded-xl p-2 text-center cursor-pointer mt-1">
                      <input type="file" id="dlFront" className="hidden" onChange={(e) => handleFileUpload('driverLicenseFront', e.target.files[0])} />
                      <div>{uploadedFiles.driverLicenseFront || '📸 Upload Front'}</div>
                    </div>
                  </div>
                  <div><label className="text-xs font-semibold">Driving License (Back) <span className="text-red-500">*</span></label>
                    <div onClick={() => document.getElementById('dlBack').click()} className="border-2 border-dashed rounded-xl p-2 text-center cursor-pointer mt-1">
                      <input type="file" id="dlBack" className="hidden" onChange={(e) => handleFileUpload('driverLicenseBack', e.target.files[0])} />
                      <div>{uploadedFiles.driverLicenseBack || '📸 Upload Back'}</div>
                    </div>
                  </div>
                  <div><label className="text-xs font-semibold">Identity Proof (Aadhaar/PAN) <span className="text-red-500">*</span></label>
                    <div onClick={() => document.getElementById('idProof').click()} className="border-2 border-dashed rounded-xl p-2 text-center cursor-pointer mt-1">
                      <input type="file" id="idProof" className="hidden" onChange={(e) => handleFileUpload('identityProof', e.target.files[0])} />
                      <div>{uploadedFiles.identityProof || '📄 Upload ID'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Vehicle Details & Documents */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="font-semibold text-slate-800">🚗 Vehicle Information & Documents</h3>
              <p className="text-xs text-gray-500">Complete vehicle specs, RC, insurance, permits, and compliance</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderField('Vehicle Type', 'vehicleType', 'text', true, vehicleTypes)}
                {renderField('Make/Brand', 'make', 'text', true)}
                {renderField('Model', 'model', 'text', true)}
                {renderField('Year of Manufacture', 'yearOfManufacture', 'number', true)}
                {renderField('Color', 'color', 'text', true)}
                {renderField('Seating Capacity (excl. driver)', 'seatingCapacity', 'number', true)}
                {renderField('Fuel Type', 'fuelType', 'text', true, fuelTypes)}
                {renderField('Registration Number (Plate)', 'registrationNumber', 'text', true)}
                {renderField('VIN/Chassis Number', 'vinChassis', 'text', true)}
              </div>
              
              <div className="border-t pt-5 mt-3">
                <h4 className="font-medium mb-3">📋 Registration Certificate (RC)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField('RC Number', 'rcNumber', 'text', true)}
                  {renderField('RC Issue Date', 'rcIssueDate', 'date', true)}
                  {renderField('Issuing RTO', 'rcIssuingRTO', 'text', true)}
                </div>
              </div>
              
              <div className="border-t pt-5 mt-3">
                <h4 className="font-medium mb-3">🛡️ Insurance & PUC</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Insurance Policy Number', 'insurancePolicyNumber', 'text', true)}
                  {renderField('Insurance Expiry Date', 'insuranceExpiryDate', 'date', true)}
                  {renderField('PUC Certificate Number', 'pucCertificateNumber', 'text', true)}
                  {renderField('PUC Expiry Date', 'pucExpiryDate', 'date', true)}
                </div>
              </div>
              
              {(vehicleDetails.vehicleType === 'taxi' || vehicleDetails.vehicleType === 'auto') && (
                <div className="border-t pt-5 mt-3">
                  <h4 className="font-medium mb-3">✅ Fitness & Permit (Commercial)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('Certificate of Fitness Number', 'certificateOfFitnessNumber', 'text', true)}
                    {renderField('Fitness Certificate Expiry', 'certificateOfFitnessExpiry', 'date', true)}
                  </div>
                  {vehicleDetails.vehicleType === 'taxi' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      {renderField('Permit Number', 'permitNumber', 'text', true)}
                      {renderField('Permit Type', 'permitType', 'text', true, permitTypes)}
                      {renderField('Permit Expiry Date', 'permitExpiryDate', 'date', true)}
                    </div>
                  )}
                </div>
              )}
              
              <div className="border-t pt-5 mt-3">
                <h4 className="font-medium mb-3">💰 Tax & Compliance Declaration</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3"><input type="checkbox" checked={vehicleDetails.taxTokenPaid} onChange={(e) => setVehicleDetails(prev => ({...prev, taxTokenPaid: e.target.checked}))} /> <span className="text-sm">I confirm that tax token has been paid</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" checked={vehicleDetails.noUnpaidFines} onChange={(e) => setVehicleDetails(prev => ({...prev, noUnpaidFines: e.target.checked}))} /> <span className="text-sm">I confirm there are no unpaid fines/challans on this vehicle</span></label>
                </div>
                {errors.taxTokenPaid && <div className="text-xs text-red-500 mt-1">⚠️ {errors.taxTokenPaid}</div>}
                {errors.noUnpaidFines && <div className="text-xs text-red-500">⚠️ {errors.noUnpaidFines}</div>}
              </div>
              
              <div className="border-t pt-5 mt-3">
                <h4 className="font-medium mb-3">📎 Document Uploads</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[{key:'vehicleRC', label:'Vehicle RC Scan'},{key:'insuranceCertificate', label:'Insurance Certificate'},{key:'pucCertificate', label:'PUC Certificate'}].map(doc => (
                    <div key={doc.key}>
                      <div onClick={() => document.getElementById(doc.key).click()} className="border-2 border-dashed rounded-xl p-2 text-center cursor-pointer">
                        <input type="file" id={doc.key} className="hidden" onChange={(e) => handleFileUpload(doc.key, e.target.files[0])} />
                        <div>{uploadedFiles[doc.key] ? `✅ ${uploadedFiles[doc.key]}` : `📄 ${doc.label}`}</div>
                      </div>
                      {errors[doc.key] && <div className="text-xs text-red-500">⚠️ {errors[doc.key]}</div>}
                    </div>
                  ))}
                  {(vehicleDetails.vehicleType === 'taxi' || vehicleDetails.vehicleType === 'auto') && (
                    <div><div onClick={() => document.getElementById('fitnessCertificate').click()} className="border-2 border-dashed rounded-xl p-2 text-center cursor-pointer"><input type="file" id="fitnessCertificate" className="hidden" onChange={(e) => handleFileUpload('fitnessCertificate', e.target.files[0])} /><div>{uploadedFiles.fitnessCertificate || '📄 Fitness Certificate'}</div></div>{errors.fitnessCertificate && <div className="text-xs text-red-500">⚠️ {errors.fitnessCertificate}</div>}</div>
                  )}
                  {vehicleDetails.vehicleType === 'taxi' && (
                    <div><div onClick={() => document.getElementById('permitCertificate').click()} className="border-2 border-dashed rounded-xl p-2 text-center cursor-pointer"><input type="file" id="permitCertificate" className="hidden" onChange={(e) => handleFileUpload('permitCertificate', e.target.files[0])} /><div>{uploadedFiles.permitCertificate || '📄 Permit Certificate'}</div></div>{errors.permitCertificate && <div className="text-xs text-red-500">⚠️ {errors.permitCertificate}</div>}</div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-5 mt-3">
                <label className="flex items-center gap-3"><input type="checkbox" checked={tosAccepted} onChange={(e) => setTosAccepted(e.target.checked)} /> <span className="text-sm">I accept the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>, and consent to background verification as required by law.</span></label>
                {errors.tosAccepted && <div className="text-xs text-red-500">⚠️ {errors.tosAccepted}</div>}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Review Summary */}
        {step === 4 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-4">📋 Review Your Application</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">Name:</span><span>{driverProfile.fullName}</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">Mobile:</span><span>{driverProfile.mobile} {mobileVerified ? '✓' : '⚠️'}</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">Email:</span><span>{driverProfile.email} {emailVerified ? '✓' : '⚠️'}</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">License:</span><span>{driverProfile.licenseNumber} ({driverProfile.licenseClass})</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">Experience:</span><span>{calculateExperience(driverProfile.licenseIssueDate)} years</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">Vehicle:</span><span>{vehicleDetails.make} {vehicleDetails.model} ({vehicleDetails.yearOfManufacture})</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">Reg Number:</span><span>{vehicleDetails.registrationNumber}</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm border-b pb-2"><span className="font-semibold">Insurance Expiry:</span><span>{vehicleDetails.insuranceExpiryDate}</span></div>
              <div className="grid grid-cols-2 gap-2 text-sm"><span className="font-semibold">Documents Uploaded:</span><span>{Object.values(uploadedFiles).filter(f => f).length}/10</span></div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="bg-white rounded-xl p-4 flex justify-between items-center mt-6 shadow-sm">
          <div>{step > 1 && <button onClick={prevStep} className="px-5 py-2 border rounded-xl hover:bg-gray-50">← Back</button>}</div>
          <div className="text-xs text-gray-500">Step {step} of 4</div>
          <div>{step < 4 ? <button onClick={nextStep} className="bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700">Continue →</button> : <button onClick={submitForm} className="bg-slate-800 text-white px-6 py-2 rounded-xl hover:bg-slate-900">✉ Submit Application</button>}</div>
        </div>
      </div>
      
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[380px]">
            <h3 className="text-lg font-semibold">📱 Verify Mobile</h3>
            <p className="text-sm text-gray-500 mb-4">Enter 6-digit code sent to {driverProfile.mobile}</p>
            <div className="flex gap-2 justify-center mb-4">
              {otpCode.map((digit, idx) => (
                <input key={idx} ref={el => otpInputRefs.current[idx] = el} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(idx, e.target.value, false)} className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold focus:border-teal-500" />
              ))}
            </div>
            <button onClick={confirmMobileOtp} className="w-full bg-teal-600 text-white py-2 rounded-xl">Verify</button>
          </div>
        </div>
      )}
      
      {/* Email OTP Modal */}
      {emailOtpSent && !showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[380px]">
            <h3 className="text-lg font-semibold">📧 Verify Email</h3>
            <p className="text-sm text-gray-500 mb-4">Enter 6-digit code sent to {driverProfile.email}</p>
            <div className="flex gap-2 justify-center mb-4">
              {otpCode.map((digit, idx) => (
                <input key={idx} ref={el => otpInputRefsEmail.current[idx] = el} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(idx, e.target.value, true)} className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold" />
              ))}
            </div>
            <button onClick={confirmEmailOtp} className="w-full bg-teal-600 text-white py-2 rounded-xl">Verify</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportDashboard;
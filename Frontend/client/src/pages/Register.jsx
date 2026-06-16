import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Full Name validation
  const validateFullName = (name) => {
    if (!name) {
      return 'Full name is required';
    }
    if (name.length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    return '';
  };

  // User Type validation
  const validateUserType = (type) => {
    if (!type) {
      return 'Please select your role';
    }
    return '';
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Phone validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  // Confirm Password validation
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Password requirements checker
  const getPasswordRequirements = (password) => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One lowercase letter', met: /[a-z]/.test(password) },
      { label: 'One number', met: /[0-9]/.test(password) },
      { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Real-time validation for touched fields
    if (touched[name]) {
      let newError = '';
      if (name === 'fullName') newError = validateFullName(value);
      else if (name === 'email') newError = validateEmail(value);
      else if (name === 'phone') newError = validatePhone(value);
      else if (name === 'userType') newError = validateUserType(value);
      else if (name === 'password') newError = validatePassword(value);
      else if (name === 'confirmPassword') newError = validateConfirmPassword(value, formData.password);
      
      setErrors({
        ...errors,
        [name]: newError,
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    
    // Validate on blur
    let newError = '';
    if (name === 'fullName') newError = validateFullName(value);
    else if (name === 'email') newError = validateEmail(value);
    else if (name === 'phone') newError = validatePhone(value);
    else if (name === 'userType') newError = validateUserType(value);
    else if (name === 'password') newError = validatePassword(value);
    else if (name === 'confirmPassword') newError = validateConfirmPassword(value, formData.password);
    
    setErrors({
      ...errors,
      [name]: newError,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      userType: true,
      password: true,
      confirmPassword: true,
    });
    
    // Validate all fields
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      userType: validateUserType(formData.userType),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    
    if (!hasErrors) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        console.log('Registration successful:', formData);
        
        // Redirect to login page after successful registration
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:', error);
        setErrors({ submit: 'Registration failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Join AgriConnect</h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="farmer@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>

          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I am a
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Farmer Option */}
              <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.userType === 'farmer'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="farmer"
                  checked={formData.userType === 'farmer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    formData.userType === 'farmer'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className={`font-semibold text-sm ${
                    formData.userType === 'farmer' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Farmer
                  </span>
                  <span className="text-xs text-gray-500 mt-1">I grow crops</span>
                </div>
                {formData.userType === 'farmer' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>

              {/* Middleman Option */}
              <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.userType === 'middleman'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="middleman"
                  checked={formData.userType === 'middleman'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    formData.userType === 'middleman'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <span className={`font-semibold text-sm ${
                    formData.userType === 'middleman' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Middleman
                  </span>
                  <span className="text-xs text-gray-500 mt-1">I connect sellers & buyers</span>
                </div>
                {formData.userType === 'middleman' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>

              {/* Buyer Option */}
              <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.userType === 'buyer'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="buyer"
                  checked={formData.userType === 'buyer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    formData.userType === 'buyer'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className={`font-semibold text-sm ${
                    formData.userType === 'buyer' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Buyer
                  </span>
                  <span className="text-xs text-gray-500 mt-1">I purchase produce</span>
                </div>
                {formData.userType === 'buyer' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            </div>
            {errors.userType && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.userType}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
            
            {/* Password Requirements */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Password requirements:</p>
              <ul className="space-y-1">
                {getPasswordRequirements(formData.password).map((req, index) => (
                  <li
                    key={index}
                    className={`text-xs flex items-center gap-2 ${
                      req.met ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {req.met ? (
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

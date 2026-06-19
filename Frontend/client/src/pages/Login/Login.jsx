import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

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

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (loginType === 'admin') {
      if (password.length < 6) {
        return 'Password must be at least 6 characters';
      }
    } else {
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
      const newError = name === 'email' ? validateEmail(value) : validatePassword(value);
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
    const newError = name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors({
      ...errors,
      [name]: newError,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
    // Validate all fields
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    
    if (!hasErrors) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ submit: data.message || 'Login failed. Please try again.' });
          return;
        }

        const user = data.user;

        // Check if the login type matches the role
        if (loginType === 'admin' && user.role !== 'admin') {
          setErrors({ submit: 'This account does not have admin privileges.' });
          return;
        }

        if (loginType === 'user' && user.role === 'admin') {
          setErrors({ submit: 'Please use the Admin login to access this account.' });
          return;
        }

        // Store user info
        if (loginType === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify(user));
          navigate('/admin-dashboard');
        } else {
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/');
        }

      } catch (error) {
        console.error('Login failed:', error);
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
            A
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Login to your AgriConnect account</p>
        </div>

        {/* Login Type Selector */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setLoginType('user'); setErrors({}); setTouched({}); }}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                loginType === 'user'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('admin'); setErrors({}); setTouched({}); }}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                loginType === 'admin'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Login
            </button>
          </div>
        </div>

        {/* Admin Notice */}
        {loginType === 'admin' && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Admin access requires authorized credentials. Only admin accounts can access the dashboard.
            </p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                  : loginType === 'admin'
                    ? 'border-gray-300 focus:ring-slate-500 focus:border-slate-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder={loginType === 'admin' ? 'admin@agriconnect.com' : 'farmer@example.com'}
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
                  : loginType === 'admin'
                    ? 'border-gray-300 focus:ring-slate-500 focus:border-slate-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
            </div>


          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className={`w-4 h-4 border-gray-300 rounded focus:ring-green-500 ${loginType === 'admin' ? 'text-slate-600 focus:ring-slate-500' : 'text-green-600'}`}
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              className={`text-sm font-medium ${loginType === 'admin' ? 'text-slate-600 hover:text-slate-700' : 'text-green-600 hover:text-green-700'}`}
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : loginType === 'admin'
                  ? 'bg-slate-800 hover:bg-slate-900 hover:shadow-lg transform hover:scale-[1.02]'
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              loginType === 'admin' ? 'Admin Login' : 'Login'
            )}
          </button>
        </form>

        {/* Sign Up Link - only for user */}
        {loginType === 'user' && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Sign Up
              </a>
            </p>
          </div>
        )}

        {/* Admin hint */}
        {loginType === 'admin' && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Admin accounts are created by system administrators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransportRegistrationBar = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    navigate('/transport-dashboard');
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Main Content */}
        <div className="flex-1 p-8 md:p-10">
          {/* NEW Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
            NEW
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Register Your Transport & Grow Your Business
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-base mb-8">
            Join our trusted transport network and get consistent requests from farmers and businesses.
          </p>

          {/* Features Grid - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
            {/* Left Column Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Verified Partners</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Consistent Transport Requests</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Grow Your Earnings</span>
              </div>
            </div>

            {/* Right Column Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Increase your visibility</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Get more transport bookings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Reliable payments</span>
              </div>
            </div>
          </div>

          {/* CTA Button with Truck Animation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <button
              onClick={handleClick}
              className={`
                inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 
                text-white font-semibold px-6 py-3 rounded-xl
                transition-all duration-300 shadow-md hover:shadow-lg
                ${isAnimating ? 'animate-truck-move' : ''}
              `}
            >
              <span>Register Transport Now</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${
                  isAnimating ? 'animate-truck-drive' : 'group-hover:translate-x-1'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 18h8M8 18a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2m-8 0a2 2 0 102 0m-2 0h2m0 0h8m-8 0a2 2 0 102 0m2-4h4m-4 0v-4m0 0h-2m0 0a2 2 0 00-2-2h-2m0 0v4"
                />
              </svg>
            </button>
            
            <div className="text-sm text-gray-500">
              Free to register • No hidden charges
            </div>
          </div>
        </div>

        {/* Right Section - Illustration/Image */}
        <div className="hidden md:flex md:w-80 bg-gradient-to-br from-blue-50 to-indigo-50 items-center justify-center p-8">
          <div className="text-center">
            {/* Truck Illustration */}
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M8 18h8M8 18a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2m-8 0a2 2 0 102 0m-2 0h2m0 0h8m-8 0a2 2 0 102 0m2-4h4m-4 0v-4m0 0h-2m0 0a2 2 0 00-2-2h-2m0 0v4"
                  />
                </svg>
              </div>
              {/* Animated dots around truck */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300" />
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Join 10,000+ trusted transporters
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes truckMove {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
        
        @keyframes truckDrive {
          0%, 100% { transform: translateX(0); }
          40% { transform: translateX(15px); }
          60% { transform: translateX(-5px); }
        }
        
        .animate-truck-move {
          animation: truckMove 0.5s ease-in-out;
        }
        
        .animate-truck-drive {
          animation: truckDrive 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default TransportRegistrationBar;
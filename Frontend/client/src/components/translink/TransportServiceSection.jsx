// src/components/TransportServicesSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransportServicesSection = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    navigate('/transport-dashboard');
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const handleBookClick = () => {
    navigate('/book-transport');
  };

  const handleTrackClick = () => {
    navigate('/track-vehicle');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Transport Services
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete logistics solution for your agricultural transport needs
        </p>
      </div>

      {/* Three Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Register Transport */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="p-6">
            {/* Icon Container */}
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
              <svg 
                className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" 
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
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Register Your Transport
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">
              Join our trusted transport network and get consistent requests from farmers and businesses.
            </p>
            
            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Verified Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Consistent Transport Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Grow Your Earnings</span>
              </div>
            </div>
            
            {/* Button */}
            <button
              onClick={handleRegisterClick}
              className={`
                w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
                text-white font-semibold px-4 py-2.5 rounded-xl
                transition-all duration-300 shadow-md hover:shadow-lg
                ${isAnimating ? 'animate-truck-move' : ''}
              `}
            >
              <span>Register Now</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${
                  isAnimating ? 'animate-truck-drive' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card 2: Book Your Transport */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="p-6">
            {/* Icon Container */}
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors duration-300">
              <svg 
                className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M5 21h14M7 17h10" 
                />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Book Your Transport
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">
              Find reliable transporters for your agricultural products at competitive rates.
            </p>
            
            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Verified Transporters</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Instant Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Best Price Guarantee</span>
              </div>
            </div>
            
            {/* Button */}
            <button
              onClick={handleBookClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>Book Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card 3: Track Your Vehicle */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="p-6">
            {/* Icon Container */}
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300">
              <svg 
                className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Track Your Vehicle
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">
              Real-time GPS tracking of your transport vehicles for complete visibility.
            </p>
            
            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Live Location Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Estimated Delivery Time</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Trip History</span>
              </div>
            </div>
            
            {/* Button */}
            <button
              onClick={handleTrackClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>Track Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes truckMove {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
        }
        
        @keyframes truckDrive {
          0%, 100% { transform: translateX(0); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-3px); }
        }
        
        .animate-truck-move {
          animation: truckMove 0.5s ease-in-out;
        }
        
        .animate-truck-drive {
          animation: truckDrive 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
};

export default TransportServicesSection;
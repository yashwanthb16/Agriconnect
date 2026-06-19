import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { getOwnerBookings } from '../../pages/Services/transportApi';

function Navbar() {
  const [user, setUser] = useState(null);
  const [pendingBookings, setPendingBookings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(storedUser);
    };
    checkUser();
    const interval = setInterval(checkUser, 500);
    return () => clearInterval(interval);
  }, []);

  // Poll for pending bookings
  useEffect(() => {
    if (!user?._id) return;
    const fetchPending = async () => {
      try {
        const res = await getOwnerBookings(user._id, 'pending');
        setPendingBookings(res.data.pending || 0);
      } catch (err) {
        // silent
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-xl">🌾</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">AgriConnect</span>
              <p className="text-[10px] text-gray-500 -mt-1">Farm to Market</p>
            </div>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors">Home</Link>
            <Link to="/marketplace" className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors">Marketplace</Link>
            <Link to="/my-transports" className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors relative">
              {user ? 'My Transports' : 'Transport'}
              {pendingBookings > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {pendingBookings}
                </span>
              )}
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t px-4 py-2 flex items-center justify-around">
        <Link to="/" className="text-xs text-gray-600 hover:text-green-600 font-medium py-1">Home</Link>
        <Link to="/marketplace" className="text-xs text-gray-600 hover:text-green-600 font-medium py-1">Market</Link>
        <Link to="/my-transports" className="text-xs text-gray-600 hover:text-green-600 font-medium py-1 relative">
          Transport
          {pendingBookings > 0 && (
            <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {pendingBookings}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

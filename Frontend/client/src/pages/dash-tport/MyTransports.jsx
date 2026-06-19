import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRegistrations } from '../Services/transportApi';

function MyTransports() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await getMyRegistrations(user._id);
      setRegistrations(res.data.data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Transports</h1>
            <p className="text-gray-500 mt-1">Manage your transport registrations and view earnings</p>
          </div>
          <button
            onClick={() => navigate('/transport-dashboard')}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Register New Transport
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your transports...</p>
          </div>
        )}

        {/* No registrations */}
        {!loading && registrations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚛</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Transport Registrations Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't registered any transport vehicles yet. Click the button below to start.
            </p>
            <button
              onClick={() => navigate('/transport-dashboard')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              Register Your First Transport
            </button>
          </div>
        )}

        {/* Transport Cards Grid */}
        {!loading && registrations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                onClick={() => navigate(`/transport-detail/${reg._id}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all cursor-pointer group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      {reg.vehicleDetails?.vehicleType === 'truck' ? '🚛' :
                       reg.vehicleDetails?.vehicleType === 'van' ? '🚐' :
                       reg.vehicleDetails?.vehicleType === 'bus' ? '🚌' :
                       reg.vehicleDetails?.vehicleType === 'auto' ? '🛺' : '🚕'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {reg.vehicleDetails?.make || ''} {reg.vehicleDetails?.model || ''}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {reg.vehicleDetails?.vehicleType?.toUpperCase()} • {reg.vehicleDetails?.registrationNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {statusBadge(reg.status)}
                </div>

                {/* Driver info */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                    {reg.driverProfile?.fullName?.[0]?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{reg.driverProfile?.fullName || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{reg.driverProfile?.mobile || ''} • {reg.driverProfile?.email || ''}</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{reg.totalTrips || 0}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Trips</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">₹{reg.totalEarnings?.toLocaleString() || '0'}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Earned</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">
                      {reg.verification?.mobileVerified && reg.verification?.emailVerified ? '✓' : '—'}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase">Verified</p>
                  </div>
                </div>

                {/* Registration ID */}
                {reg.registrationId && (
                  <p className="text-xs text-gray-400 mt-3 text-center font-mono">{reg.registrationId}</p>
                )}

                {/* View arrow */}
                <div className="text-right mt-3">
                  <span className="text-green-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                    View Details →
                  </span>
                </div>
              </div>
            ))}

            {/* Add New Transport Card */}
            <div
              onClick={() => navigate('/transport-dashboard')}
              className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[280px] group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Register New Transport</h3>
              <p className="text-sm text-gray-500 text-center">Add another vehicle to your fleet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTransports;

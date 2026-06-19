import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { getDriverBookings, acceptBooking, rejectBooking } from '../Services/transportApi';

function TransportDetail() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  // Availability modal
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [availForm, setAvailForm] = useState({
    fromLocation: '',
    toLocation: '',
    currentLocation: '',
    availableFromDate: '',
    availableToDate: '',
    pricePerKm: '',
    notes: '',
    withDriver: true,
    maxCapacityKg: '',
    allowSharedGoods: true,
  });

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    fetchRegistration();
    fetchBookings();
  }, [driverId]);

  const fetchRegistration = async () => {
    try {
      const res = await API.get(`/${driverId}`);
      setRegistration(res.data.data);
      // Pre-fill availability form
      const av = res.data.data.availabilityDetails || {};
      setAvailForm({
        fromLocation: av.fromLocation || '',
        toLocation: av.toLocation || '',
        currentLocation: av.currentLocation || '',
        availableFromDate: av.availableFromDate ? new Date(av.availableFromDate).toISOString().slice(0, 16) : '',
        availableToDate: av.availableToDate ? new Date(av.availableToDate).toISOString().slice(0, 16) : '',
        pricePerKm: av.pricePerKm || '',
        notes: av.notes || '',
        withDriver: av.withDriver !== false,
        maxCapacityKg: av.maxCapacityKg || '',
        allowSharedGoods: av.allowSharedGoods !== false,
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await getDriverBookings(driverId);
      setBookings(res.data.data || []);
      setPendingCount(res.data.pending || 0);
    } catch (err) {
      console.error('Bookings error:', err);
    }
  };

  const handleAvailabilityToggle = () => {
    if (registration.verification?.isAvailable) {
      // Turn OFF availability
      setAvailability(false);
    } else {
      // Turn ON - show modal
      setShowAvailModal(true);
    }
  };

  const setAvailability = async (available, formData) => {
    try {
      const updateData = {
        driverProfile: registration.driverProfile,
        vehicleDetails: registration.vehicleDetails,
        verification: { ...registration.verification, isAvailable: available },
      };
      if (formData) {
        updateData.availabilityDetails = formData;
      }
      const res = await API.put(`/${driverId}`, updateData);
      setRegistration(res.data.data);
      setShowAvailModal(false);
    } catch (err) {
      console.error('Toggle error:', err);
      alert('Failed to update availability');
    }
  };

  const handleAvailSubmit = () => {
    if (!availForm.fromLocation || !availForm.toLocation || !availForm.currentLocation) {
      alert('Please fill in From, To, and Current Location');
      return;
    }
    setAvailability(true, availForm);
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await acceptBooking(bookingId);
      fetchBookings();
      alert('Booking accepted!');
    } catch (err) {
      alert('Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await rejectBooking(bookingId, reason || '');
      fetchBookings();
      alert('Booking rejected');
    } catch (err) {
      alert('Failed to reject booking');
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

  const bookingStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading transport details...</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Transport not found</p>
          <button onClick={() => navigate('/my-transports')} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg">
            Back to My Transports
          </button>
        </div>
      </div>
    );
  }

  const reg = registration;
  const isAvailable = reg.verification?.isAvailable || false;
  const totalEarnings = reg.totalEarnings || 0;
  const totalTrips = reg.totalTrips || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back button */}
        <button onClick={() => navigate('/my-transports')} className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Transports
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">
                {reg.vehicleDetails?.vehicleType === 'truck' ? '🚛' : reg.vehicleDetails?.vehicleType === 'van' ? '🚐' : reg.vehicleDetails?.vehicleType === 'bus' ? '🚌' : reg.vehicleDetails?.vehicleType === 'auto' ? '🛺' : '🚕'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{reg.vehicleDetails?.make || ''} {reg.vehicleDetails?.model || ''}</h1>
                <p className="text-sm text-gray-500">{reg.vehicleDetails?.vehicleType?.toUpperCase()} • {reg.vehicleDetails?.registrationNumber || 'N/A'}</p>
                <div className="flex items-center gap-2 mt-2">{statusBadge(reg.status)}</div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-gray-500 uppercase font-semibold">Availability</span>
              <button
                onClick={handleAvailabilityToggle}
                disabled={reg.status !== 'approved'}
                className={`relative w-20 h-10 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-300'} ${reg.status !== 'approved' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={reg.status !== 'approved' ? 'Only approved transports can toggle availability' : ''}
              >
                <span className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow transition-transform flex items-center justify-center text-sm ${isAvailable ? 'translate-x-11' : 'translate-x-1'}`}>
                  {isAvailable ? '🟢' : '🔴'}
                </span>
              </button>
              <span className={`text-xs font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                {isAvailable ? 'Available for trips' : 'Not available'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{totalTrips}</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Total Trips</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Total Earnings</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{totalTrips > 0 ? `₹${Math.round(totalEarnings / totalTrips).toLocaleString()}` : '₹0'}</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Avg per Trip</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Pending Requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'bookings', label: `Booking Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}`, icon: '🔔' },
              { id: 'trips', label: 'Trip History', icon: '🗺️' },
              { id: 'earnings', label: 'Earnings', icon: '💰' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab.icon} {tab.label}
                {tab.id === 'bookings' && pendingCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">👤 Driver Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="text-gray-800 font-medium">{reg.driverProfile?.fullName || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Mobile</span><span className="text-gray-800 font-medium">{reg.driverProfile?.mobile || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-800 font-medium">{reg.driverProfile?.email || 'N/A'}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">🚗 Vehicle Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="text-gray-800 font-medium">{reg.vehicleDetails?.vehicleType || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Make/Model</span><span className="text-gray-800 font-medium">{reg.vehicleDetails?.make} {reg.vehicleDetails?.model}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Reg Number</span><span className="text-gray-800 font-medium">{reg.vehicleDetails?.registrationNumber || 'N/A'}</span></div>
                  </div>
                </div>
                {/* Availability Details */}
                {isAvailable && reg.availabilityDetails && (
                  <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-bold text-green-800 mb-3">🟢 Currently Available</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-green-600 block">From</span><span className="font-medium text-gray-800">{reg.availabilityDetails.fromLocation || 'N/A'}</span></div>
                      <div><span className="text-green-600 block">To</span><span className="font-medium text-gray-800">{reg.availabilityDetails.toLocation || 'N/A'}</span></div>
                      <div><span className="text-green-600 block">Current Location</span><span className="font-medium text-gray-800">{reg.availabilityDetails.currentLocation || 'N/A'}</span></div>
                      <div><span className="text-green-600 block">Price/km</span><span className="font-medium text-gray-800">₹{reg.availabilityDetails.pricePerKm || 'N/A'}</span></div>
                      <div><span className="text-green-600 block">Service</span><span className="font-medium text-gray-800">{reg.availabilityDetails.withDriver !== false ? '👨‍✈️ With Driver' : '🔑 Without Driver'}</span></div>
                      <div><span className="text-green-600 block">Max Capacity</span><span className="font-medium text-gray-800">{reg.availabilityDetails.maxCapacityKg ? `${reg.availabilityDetails.maxCapacityKg} kg` : 'N/A'}</span></div>
                      <div><span className="text-green-600 block">Shared Goods</span><span className="font-medium text-gray-800">{reg.availabilityDetails.allowSharedGoods !== false ? '🤝 Allowed' : '❌ Not Allowed'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Booking Requests Tab */}
            {activeTab === 'bookings' && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🔔</span></div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Booking Requests</h3>
                    <p className="text-gray-500 text-sm">When someone books your transport, you'll see notifications here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className={`border rounded-xl p-5 transition ${booking.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-800">{booking.bookerName || 'Unknown'}</span>
                              {bookingStatusBadge(booking.status)}
                            </div>
                            <p className="text-xs text-gray-500">{booking.bookerEmail} • {booking.bookerPhone}</p>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div><span className="text-gray-500 block text-xs">Pickup</span><span className="font-medium text-gray-800">{booking.pickup || 'N/A'}</span></div>
                          <div><span className="text-gray-500 block text-xs">Dropoff</span><span className="font-medium text-gray-800">{booking.dropoff || 'N/A'}</span></div>
                          <div><span className="text-gray-500 block text-xs">Date</span><span className="font-medium text-gray-800">{booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'N/A'}</span></div>
                          <div><span className="text-gray-500 block text-xs">Est. Price</span><span className="font-bold text-green-600">₹{booking.estimatedPrice?.toLocaleString() || '0'}</span></div>
                        </div>

                        {booking.status === 'pending' && (
                          <div className="flex gap-3 pt-3 border-t border-yellow-200">
                            <button onClick={() => handleAcceptBooking(booking._id)} className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition">
                              ✓ Accept Booking
                            </button>
                            <button onClick={() => handleRejectBooking(booking._id)} className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition">
                              ✗ Reject
                            </button>
                          </div>
                        )}
                        {booking.status === 'rejected' && booking.rejectionReason && (
                          <p className="text-xs text-red-500 mt-2">Reason: {booking.rejectionReason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trip History Tab */}
            {activeTab === 'trips' && (
              <div>
                {reg.trips?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🗺️</span></div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Trips Yet</h3>
                    <p className="text-gray-500 text-sm">Your trip history will appear here once you start accepting bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(reg.trips || []).map((trip, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">🚛</div>
                          <div>
                            <p className="font-medium text-gray-800">{trip.pickup} → {trip.dropoff}</p>
                            <p className="text-xs text-gray-500">{new Date(trip.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{trip.amount?.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{trip.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-5 text-center border border-green-200">
                    <p className="text-3xl font-bold text-green-700">₹{totalEarnings.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">Total Earned</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-200">
                    <p className="text-3xl font-bold text-blue-700">₹0</p>
                    <p className="text-sm text-blue-600 mt-1">This Month</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-5 text-center border border-yellow-200">
                    <p className="text-3xl font-bold text-yellow-700">₹0</p>
                    <p className="text-sm text-yellow-600 mt-1">Pending</p>
                  </div>
                </div>
                {(!reg.trips || reg.trips.length === 0) && (
                  <div className="text-center py-8"><p className="text-gray-500 text-sm">No earnings data yet. Complete trips to see your earnings breakdown.</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== AVAILABILITY MODAL ===== */}
      {showAvailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAvailModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b bg-green-50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-green-800">Set Availability</h2>
                <p className="text-xs text-green-600">Tell us about your route and current position</p>
              </div>
              <button onClick={() => setShowAvailModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-100 text-green-600 text-lg">✕</button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* With/Without Driver */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Service Type *</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAvailForm({ ...availForm, withDriver: true })}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition ${availForm.withDriver ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-1">👨‍✈️</div>
                    With Driver
                    <div className="text-xs font-normal mt-1 opacity-70">You provide the driver</div>
                  </button>
                  <button
                    onClick={() => setAvailForm({ ...availForm, withDriver: false })}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition ${!availForm.withDriver ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-1">🔑</div>
                    Without Driver
                    <div className="text-xs font-normal mt-1 opacity-70">Self-drive / rent only</div>
                  </button>
                </div>
              </div>

              {/* From */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">From Location *</label>
                <input type="text" value={availForm.fromLocation} onChange={(e) => setAvailForm({ ...availForm, fromLocation: e.target.value })} placeholder="e.g. Chennai, TN" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              {/* To */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">To Location *</label>
                <input type="text" value={availForm.toLocation} onChange={(e) => setAvailForm({ ...availForm, toLocation: e.target.value })} placeholder="e.g. Coimbatore, TN" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              {/* Current Location */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Current Driver Location *</label>
                <input type="text" value={availForm.currentLocation} onChange={(e) => setAvailForm({ ...availForm, currentLocation: e.target.value })} placeholder="Where is the driver now? e.g. Salem, TN" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              {/* Max Capacity + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Max Capacity (kg)</label>
                  <input type="number" value={availForm.maxCapacityKg} onChange={(e) => setAvailForm({ ...availForm, maxCapacityKg: e.target.value })} placeholder="e.g. 500" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Price per KM (₹)</label>
                  <input type="number" value={availForm.pricePerKm} onChange={(e) => setAvailForm({ ...availForm, pricePerKm: e.target.value })} placeholder="e.g. 15" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Available From</label>
                  <input type="datetime-local" value={availForm.availableFromDate} onChange={(e) => setAvailForm({ ...availForm, availableFromDate: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Available Until</label>
                  <input type="datetime-local" value={availForm.availableToDate} onChange={(e) => setAvailForm({ ...availForm, availableToDate: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              {/* Allow Shared Goods */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">🤝 Allow Shared Goods</p>
                  <p className="text-xs text-gray-500 mt-0.5">Let other users share remaining vehicle capacity along your route</p>
                </div>
                <button
                  onClick={() => setAvailForm({ ...availForm, allowSharedGoods: !availForm.allowSharedGoods })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${availForm.allowSharedGoods ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform flex items-center justify-center text-xs ${availForm.allowSharedGoods ? 'translate-x-7' : 'translate-x-0.5'}`}>
                    {availForm.allowSharedGoods ? '✓' : '✗'}
                  </span>
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Additional Notes</label>
                <textarea value={availForm.notes} onChange={(e) => setAvailForm({ ...availForm, notes: e.target.value })} placeholder="Any special conditions or info for bookers..." className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows={2} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <button onClick={() => setShowAvailModal(false)} className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm">Cancel</button>
              <button onClick={handleAvailSubmit} className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition shadow-md">
                ✓ Confirm & Go Available
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransportDetail;

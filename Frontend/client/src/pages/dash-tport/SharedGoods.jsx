import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSharedTrips, createSharedBooking } from '../Services/transportApi';

function SharedGoods() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookForm, setBookForm] = useState({
    weight: '',
    pickup: '',
    dropoff: '',
    bookerName: '',
    bookerPhone: '',
    bookerEmail: '',
  });

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async (from, to) => {
    try {
      setLoading(true);
      const res = await getSharedTrips(from || fromFilter, to || toFilter);
      setTrips(res.data.data || []);
    } catch (err) {
      console.error('Error fetching shared trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTrips(fromFilter, toFilter);
  };

  const openBookModal = (trip) => {
    setSelectedTrip(trip);
    setBookForm({
      weight: '',
      pickup: trip.pickup || '',
      dropoff: trip.dropoff || '',
      bookerName: user?.name || '',
      bookerPhone: '',
      bookerEmail: user?.email || '',
    });
    setShowBookModal(true);
  };

  const handleSharedBooking = async () => {
    if (!bookForm.weight || !bookForm.pickup || !bookForm.dropoff) {
      alert('Please fill in weight, pickup, and dropoff');
      return;
    }
    if (Number(bookForm.weight) > selectedTrip.remainingCapacityKg) {
      alert(`Weight exceeds remaining capacity. Available: ${selectedTrip.remainingCapacityKg}kg`);
      return;
    }
    try {
      const pricePerKg = selectedTrip.pricePerKg || 10;
      const estimatedPrice = Number(bookForm.weight) * pricePerKg;

      await createSharedBooking({
        driverId: selectedTrip.driverId?._id,
        parentBookingId: selectedTrip._id,
        pickup: bookForm.pickup,
        dropoff: bookForm.dropoff,
        weight: Number(bookForm.weight),
        vehicleType: selectedTrip.vehicleType,
        estimatedPrice,
        bookerName: bookForm.bookerName,
        bookerPhone: bookForm.bookerPhone,
        bookerEmail: bookForm.bookerEmail,
      });

      alert('Shared booking request sent to transport owner!');
      setShowBookModal(false);
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create shared booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">🤝 Shared Goods Transport</h1>
          <p className="text-sm text-gray-500 mt-1">Share vehicle capacity with other users on the same route — save money, reduce waste</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={fromFilter}
              onChange={(e) => setFromFilter(e.target.value)}
              placeholder="From (e.g. Chennai)"
              className="flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              value={toFilter}
              onChange={(e) => setToFilter(e.target.value)}
              placeholder="To (e.g. Coimbatore)"
              className="flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition"
            >
              🔍 Search Shared Trips
            </button>
          </div>
        </div>

        {/* Trips List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading shared trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Shared Trips Available</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              When a transport has remaining capacity after a booking, it will appear here for other users to share.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div key={trip._id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Trip Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {trip.vehicleType === 'large_truck' ? '🚛' : trip.vehicleType === 'small_truck' ? '🚚' : trip.vehicleType === 'van' ? '🚐' : '🚕'}
                      </span>
                      <div>
                        <span className="font-bold text-gray-800">{trip.pickup} → {trip.dropoff}</span>
                        <div className="text-xs text-gray-500">
                          Driver: {trip.driverName} • {trip.withDriver ? '👨‍✈️ With Driver' : '🔑 Self-Drive'}
                        </div>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Used: {trip.usedCapacityKg}kg</span>
                        <span className="font-bold text-green-600">Available: {trip.remainingCapacityKg}kg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(100, ((trip.usedCapacityKg / trip.totalCapacityKg) * 100))}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0 kg</span>
                        <span>{trip.totalCapacityKg} kg total</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      <span>📅 {trip.pickupDate ? new Date(trip.pickupDate).toLocaleDateString() : 'TBD'}</span>
                      <span>📦 {trip.sharedBookingsCount} shared bookings</span>
                      <span>💰 ₹{trip.pricePerKg}/kg</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => openBookModal(trip)}
                    disabled={!user}
                    className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {user ? '📦 Book Shared Space' : 'Login Required'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== SHARED BOOKING MODAL ===== */}
      {showBookModal && selectedTrip && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowBookModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b bg-green-50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-green-800">📦 Book Shared Goods Space</h2>
                <p className="text-xs text-green-600">{selectedTrip.pickup} → {selectedTrip.dropoff} • {selectedTrip.remainingCapacityKg}kg available</p>
              </div>
              <button onClick={() => setShowBookModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-100 text-green-600 text-lg">✕</button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                <strong>ℹ️ Shared Goods:</strong> Your goods will travel alongside the primary booking. Pickup/dropoff must be within the driver's existing route.
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Weight (kg) * <span className="text-green-600">(max: {selectedTrip.remainingCapacityKg}kg)</span></label>
                <input type="number" value={bookForm.weight} onChange={(e) => setBookForm({ ...bookForm, weight: e.target.value })} placeholder="Enter weight in kg" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" max={selectedTrip.remainingCapacityKg} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Pickup Location * <span className="text-gray-400">(within route)</span></label>
                <input type="text" value={bookForm.pickup} onChange={(e) => setBookForm({ ...bookForm, pickup: e.target.value })} placeholder="Where to pick up your goods" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Dropoff Location * <span className="text-gray-400">(within route)</span></label>
                <input type="text" value={bookForm.dropoff} onChange={(e) => setBookForm({ ...bookForm, dropoff: e.target.value })} placeholder="Where to deliver your goods" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Your Name</label>
                <input type="text" value={bookForm.bookerName} onChange={(e) => setBookForm({ ...bookForm, bookerName: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Phone</label>
                  <input type="text" value={bookForm.bookerPhone} onChange={(e) => setBookForm({ ...bookForm, bookerPhone: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Email</label>
                  <input type="email" value={bookForm.bookerEmail} onChange={(e) => setBookForm({ ...bookForm, bookerEmail: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              {/* Price Estimate */}
              {bookForm.weight && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Price:</span>
                    <span className="font-bold text-green-700">₹{(Number(bookForm.weight) * (selectedTrip.pricePerKg || 10)).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{bookForm.weight}kg × ₹{selectedTrip.pricePerKg || 10}/kg</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <button onClick={() => setShowBookModal(false)} className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm">Cancel</button>
              <button onClick={handleSharedBooking} className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition shadow-md">
                📦 Confirm Shared Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SharedGoods;

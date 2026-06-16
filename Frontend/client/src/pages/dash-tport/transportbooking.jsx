import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Navigation, Weight, Truck, User, Phone, FileText, Users, Search, UserPlus, CheckCircle, X, Info, AlertTriangle, List, Plus, ArrowRight, CreditCard, Receipt, LayoutDashboard, Package, Shield, Box } from 'lucide-react';

const VEHICLES = {
  bike: { name: 'Bike', icon: '🏍️', rate: 5, max: 50, desc: 'Perfect for small parcels' },
  small_truck: { name: 'Small Truck', icon: '🚚', rate: 15, max: 500, desc: 'Ideal for household moves' },
  van: { name: 'Van', icon: '🚐', rate: 20, max: 800, desc: 'Great for medium loads' },
  large_truck: { name: 'Large Truck', icon: '🚛', rate: 30, max: 2000, desc: 'For commercial shipping' }
};

const AVAILABLE_TRIPS_INITIAL = [
  {
    id: "TRIP001",
    creator: "Logistics India",
    pickup: "Chennai, TN",
    dropoff: "Coimbatore, TN",
    vehicle: "large_truck",
    usedWeight: 850,
    maxWeight: 2000,
    departureTime: "2026-06-15T09:00",
    participants: [{ name: "Logistics India", weight: 850 }]
  },
  {
    id: "TRIP002",
    creator: "Tamil Nadu Movers",
    pickup: "Chennai, TN",
    dropoff: "Coimbatore, TN",
    vehicle: "small_truck",
    usedWeight: 320,
    maxWeight: 500,
    departureTime: "2026-06-15T11:00",
    participants: [{ name: "Tamil Nadu Movers", weight: 320 }]
  },
  {
    id: "TRIP003",
    creator: "Speedy Cargo",
    pickup: "Madurai, TN",
    dropoff: "Trichy, TN",
    vehicle: "van",
    usedWeight: 600,
    maxWeight: 800,
    departureTime: "2026-06-16T08:30",
    participants: [{ name: "Speedy Cargo", weight: 600 }]
  }
];

const transportbooking = () => {
  // Mode state
  const [mode, setMode] = useState('driver'); // driver, selfdrive, shared
  
  // Form state
  const [pickup, setPickup] = useState('Chennai, TN');
  const [dropoff, setDropoff] = useState('Coimbatore, TN');
  const [distance, setDistance] = useState(520);
  const [weight, setWeight] = useState(120);
  const [volume, setVolume] = useState(1.2);
  const [vehicle, setVehicle] = useState('small_truck');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [userName, setUserName] = useState('Ramesh Kumar');
  const [phone, setPhone] = useState('9876543210');
  const [instructions, setInstructions] = useState('');
  
  // Shared trip state
  const [availableTrips, setAvailableTrips] = useState(AVAILABLE_TRIPS_INITIAL);
  const [joinedTripId, setJoinedTripId] = useState(null);
  const [myCreatedTrip, setMyCreatedTrip] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  
  // Calculations
  const calculatePrice = useCallback(() => {
    const vehicleData = VEHICLES[vehicle];
    const distCharge = distance * vehicleData.rate;
    const weightSurcharge = Math.max(0, weight - 100) * 2;
    const volumeSurcharge = Math.max(0, volume - 1.0) * 30;
    const surcharge = weightSurcharge + volumeSurcharge;
    
    let driverFee = 0;
    if (mode === 'driver') driverFee = 100 + 0.5 * distance;
    else if (mode === 'shared') driverFee = 100 + 0.4 * distance;
    
    const total = distCharge + surcharge + driverFee;
    
    let youPay = total;
    let weightShare = 100;
    
    if (mode === 'shared') {
      let participants, totalWeight;
      if (joinedTripId) {
        const trip = availableTrips.find(t => t.id === joinedTripId);
        participants = trip.participants;
        totalWeight = participants.reduce((s, p) => s + p.weight, 0);
        const currentUser = participants.find(p => p.name === userName) || participants[0];
        weightShare = totalWeight > 0 ? (currentUser.weight / totalWeight) * 100 : 0;
        youPay = (currentUser.weight / totalWeight) * total;
      } else if (myCreatedTrip) {
        participants = myCreatedTrip.participants;
        totalWeight = participants.reduce((s, p) => s + p.weight, 0);
        weightShare = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
        youPay = (weight / totalWeight) * total;
      } else {
        weightShare = 100;
        youPay = total;
      }
    }
    
    return { distCharge, surcharge, driverFee, total, youPay, weightShare };
  }, [distance, weight, volume, vehicle, mode, joinedTripId, myCreatedTrip, userName, availableTrips]);
  
  const price = calculatePrice();
  
  // Helper functions
  const getVehicleData = (vehicleKey) => VEHICLES[vehicleKey] || VEHICLES.small_truck;
  
  const renderAvailableTrips = useCallback(() => {
    const matches = availableTrips.filter(t => 
      t.pickup.toLowerCase() === pickup.toLowerCase() && 
      t.dropoff.toLowerCase() === dropoff.toLowerCase()
    );
    
    return matches.map(trip => {
      const v = getVehicleData(trip.vehicle);
      const remaining = trip.maxWeight - trip.usedWeight;
      const pct = Math.min(100, (trip.usedWeight / trip.maxWeight) * 100);
      const projectedTotal = trip.usedWeight + weight;
      const estTotalCost = 100 + 0.4 * distance + distance * v.rate;
      const estYourCost = projectedTotal > 0 ? (weight / projectedTotal) * estTotalCost : 0;
      const isJoined = joinedTripId === trip.id;
      const fits = weight <= remaining && weight > 0;
      
      return (
        <div key={trip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#E2E6EA' }}>
          <div className="flex justify-between items-start gap-3 flex-wrap">
            <div>
              <div className="font-semibold text-gray-800">{trip.creator}</div>
              <div className="text-xs text-gray-500">{trip.pickup} → {trip.dropoff}</div>
            </div>
            <div className="text-sm">{v.icon} {v.name}</div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{trip.usedWeight}kg / {trip.maxWeight}kg used</span>
              <span>{remaining}kg remaining</span>
            </div>
            <div className="bg-gray-200 rounded h-1.5 overflow-hidden">
              <div className="bg-amber-600 h-full transition-all" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            <span><Calendar size={12} className="inline mr-1" />{new Date(trip.departureTime).toLocaleString()}</span>
            <span>Est. your cost: <span className="font-semibold text-gray-800">₹{estYourCost.toFixed(2)}</span></span>
          </div>
          <button
            onClick={() => joinTrip(trip.id)}
            disabled={!fits && !isJoined}
            className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition ${
              isJoined 
                ? 'bg-amber-600 text-white' 
                : fits 
                  ? 'bg-gray-800 text-white hover:bg-gray-900' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isJoined ? <CheckCircle size={14} className="inline mr-1" /> : null}
            {isJoined ? 'Joined' : (fits ? 'Join this trip' : 'Not enough capacity')}
          </button>
        </div>
      );
    });
  }, [availableTrips, pickup, dropoff, weight, distance, joinedTripId]);
  
  const joinTrip = (tripId) => {
    const trip = availableTrips.find(t => t.id === tripId);
    if (weight <= 0) {
      alert('Please enter your weight first.');
      return;
    }
    const remaining = trip.maxWeight - trip.usedWeight;
    if (weight > remaining) {
      alert('Not enough remaining capacity on this trip.');
      return;
    }
    
    // Remove from previous joined trip
    if (joinedTripId) {
      const prev = availableTrips.find(t => t.id === joinedTripId);
      prev.participants = prev.participants.filter(p => p.name !== userName);
      prev.usedWeight = prev.participants.reduce((s, p) => s + p.weight, 0);
    }
    
    // Add to new trip
    trip.participants.push({ name: userName, weight });
    trip.usedWeight = trip.participants.reduce((s, p) => s + p.weight, 0);
    setJoinedTripId(tripId);
    setMyCreatedTrip(null);
    setAvailableTrips([...availableTrips]);
  };
  
  const leaveTrip = () => {
    if (!joinedTripId) return;
    const trip = availableTrips.find(t => t.id === joinedTripId);
    trip.participants = trip.participants.filter(p => p.name !== userName);
    trip.usedWeight = trip.participants.reduce((s, p) => s + p.weight, 0);
    setJoinedTripId(null);
    setAvailableTrips([...availableTrips]);
  };
  
  const simulateJoin = () => {
    if (!myCreatedTrip) return;
    const vehicleData = VEHICLES[vehicle];
    const totalWeight = myCreatedTrip.participants.reduce((s, p) => s + p.weight, 0);
    const remaining = vehicleData.max - totalWeight;
    
    if (remaining <= 5) {
      alert('No remaining capacity for another participant.');
      return;
    }
    const joinWeight = Math.max(5, Math.round(Math.random() * Math.min(remaining, 150)));
    myCreatedTrip.participants.push({ 
      name: `User ${myCreatedTrip.participants.length + 1}`, 
      weight: joinWeight 
    });
    setMyCreatedTrip({ ...myCreatedTrip });
  };
  
  const findOthers = () => {
    setMatchResult({ loading: true });
    setTimeout(() => {
      setMatchResult({
        shipments: [
          { name: 'Furniture batch — Erode', weight: '85 kg' },
          { name: 'Textile rolls — Tiruppur', weight: '60 kg' },
          { name: 'Electronics crate — Salem', weight: '40 kg' }
        ]
      });
      setTimeout(() => setMatchResult(null), 4000);
    }, 1200);
  };
  
  const bookNow = () => {
    if (distance <= 0) { alert('Please enter a valid distance.'); return; }
    if (weight <= 0) { alert('Please enter a valid weight.'); return; }
    if (!userName.trim()) { alert('Please enter your name.'); return; }
    if (!phone.trim()) { alert('Please enter your phone number.'); return; }
    
    if (mode === 'shared' && !joinedTripId) {
      setMyCreatedTrip({
        vehicle: vehicle,
        participants: [{ name: userName, weight }]
      });
    }
    
    const modeLabel = {
      driver: 'Rental with Driver',
      selfdrive: 'Rental without Driver',
      shared: 'Shared Goods Transport'
    }[mode];
    
    setModalDetails({
      modeLabel,
      pickup,
      dropoff,
      vehicle: VEHICLES[vehicle].name,
      distance,
      weight,
      date: pickupDate,
      userName,
      phone,
      total: price.total,
      youPay: mode === 'shared' ? price.youPay : null
    });
    setShowModal(true);
  };
  
  const getParticipants = () => {
    if (joinedTripId) {
      const trip = availableTrips.find(t => t.id === joinedTripId);
      return trip ? trip.participants : [];
    }
    if (myCreatedTrip) {
      return myCreatedTrip.participants;
    }
    return [{ name: userName, weight }];
  };
  
  const participants = getParticipants();
  const totalWeight = participants.reduce((s, p) => s + p.weight, 0);
  const vehicleData = getVehicleData(vehicle);
  const remainingCapacity = vehicleData.max - totalWeight;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Truck size={32} className="text-gray-800" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">CargoShare</h1>
          </div>
          <p className="text-sm text-gray-500">Move goods, share rides, split costs fairly.</p>
        </div>
        
        {/* Tabs */}
        <div className="bg-white border rounded-lg mb-6 p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto">
          {[
            { id: 'driver', label: 'Rental with Driver', icon: <User size={16} /> },
            { id: 'selfdrive', label: 'Rental without Driver', icon: <SteeringWheel size={16} /> },
            { id: 'shared', label: 'Shared Goods Transport', icon: <Users size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id);
                setMatchResult(null);
              }}
              className={`flex-1 py-3 px-2 rounded-lg text-center font-medium transition flex items-center justify-center gap-2 ${
                mode === tab.id 
                  ? 'border-b-2 border-gray-800 text-gray-900 font-semibold bg-gray-50' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Available Shared Trips Section */}
            {mode === 'shared' && (
              <div className="bg-white border rounded-lg p-5 md:p-6">
                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  <List size={18} className="inline mr-2" />
                  Available Shared Trips on Your Route
                </h2>
                <p className="text-xs text-gray-500 mb-4">Matching trips for your pickup → dropoff. Join one or create your own below.</p>
                <div className="space-y-3">
                  {renderAvailableTrips().length > 0 ? renderAvailableTrips() : (
                    <div className="text-sm text-center py-4 text-gray-500">
                      <Info size={16} className="inline mr-1" />
                      No shared trips found. Create one below.
                    </div>
                  )}
                </div>
                {joinedTripId && (
                  <div className="mt-3 text-sm rounded-lg px-3 py-2 bg-green-50 text-green-800 border border-green-200">
                    <CheckCircle size={14} className="inline mr-1" />
                    You've joined a shared trip. <button onClick={leaveTrip} className="underline ml-1">Leave</button>
                  </div>
                )}
              </div>
            )}
            
            {/* Booking Form */}
            <div className="bg-white border rounded-lg p-5 md:p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                <LayoutDashboard size={18} className="inline mr-2" />
                {mode === 'shared' ? 'Create Your Shared Trip' : 'Booking Details'}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <MapPin size={12} className="inline mr-1 text-amber-600" /> Pickup location
                  </label>
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Chennai, TN" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <Navigation size={12} className="inline mr-1 text-amber-600" /> Dropoff location
                  </label>
                  <input 
                    type="text" 
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder="e.g. Coimbatore, TN" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <Navigation size={12} className="inline mr-1 text-amber-600" /> Distance (km)
                  </label>
                  <input 
                    type="number" 
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    placeholder="0" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <Weight size={12} className="inline mr-1 text-amber-600" /> Weight (kg)
                  </label>
                  <input 
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="0" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <Box size={12} className="inline mr-1 text-amber-600" /> Volume (m³) <span className="text-[10px]">optional</span>
                  </label>
                  <input 
                    type="number" 
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    step="0.1"
                    placeholder="0" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <Truck size={12} className="inline mr-1 text-amber-600" /> Vehicle type
                  </label>
                  <select 
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  >
                    {Object.entries(VEHICLES).map(([key, v]) => (
                      <option key={key} value={key}>{v.icon} {v.name} — ₹{v.rate}/km · max {v.max}kg</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <Calendar size={12} className="inline mr-1 text-amber-600" /> Pickup date & time
                  </label>
                  <input 
                    type="datetime-local" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <User size={12} className="inline mr-1 text-amber-600" /> Your name
                  </label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Full name" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <Phone size={12} className="inline mr-1 text-amber-600" /> Phone number
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number" 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium block mb-1 text-gray-500">
                    <FileText size={12} className="inline mr-1 text-amber-600" /> Special instructions
                  </label>
                  <textarea 
                    rows="2" 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Fragile items, gate code, etc." 
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  ></textarea>
                </div>
              </div>
              
              <button 
                onClick={bookNow}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                {mode === 'shared' ? 'Create Shared Trip' : 'Book Now'}
              </button>
            </div>
            
            {/* Shared Trip Intelligence */}
            {mode === 'shared' && (joinedTripId || myCreatedTrip) && (
              <div className="bg-white border rounded-lg p-5 md:p-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  <Users size={18} className="inline mr-2" />
                  Shared Trip Intelligence
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div className="rounded-lg p-3 border border-gray-200">
                    <div className="text-[11px] text-gray-500">Participants</div>
                    <div className="text-xl font-bold text-gray-800">{participants.length}</div>
                  </div>
                  <div className="rounded-lg p-3 border border-gray-200">
                    <div className="text-[11px] text-gray-500">Remaining capacity</div>
                    <div className="text-xl font-bold text-gray-800">{Math.max(0, remainingCapacity).toFixed(0)} kg</div>
                  </div>
                </div>
                {totalWeight > vehicleData.max && (
                  <div className="text-xs text-white bg-red-600 rounded-lg px-3 py-2 mb-3">
                    <AlertTriangle size={12} className="inline mr-1" />
                    Total weight exceeds vehicle capacity.
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button onClick={findOthers} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1">
                    <Search size={14} /> Find others going same route
                  </button>
                  {myCreatedTrip && (
                    <button onClick={simulateJoin} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1">
                      <UserPlus size={14} /> Simulate: another user joins
                    </button>
                  )}
                </div>
                {matchResult && (
                  <div className="text-xs rounded-lg p-3 border border-gray-200 mb-3">
                    {matchResult.loading ? (
                      <div><div className="animate-spin inline-block w-3 h-3 border-2 border-gray-800 border-t-transparent rounded-full mr-1"></div> Searching shipments...</div>
                    ) : (
                      <>
                        <div className="font-medium mb-1 text-gray-800"><Package size={12} className="inline mr-1" /> Matching shipments found</div>
                        {matchResult.shipments?.map((s, i) => (
                          <div key={i} className="flex justify-between py-0.5"><span>{s.name}</span><span>{s.weight}</span></div>
                        ))}
                      </>
                    )}
                  </div>
                )}
                <div className="text-xs space-y-1">
                  <div className="font-medium mb-1 text-gray-800">Participants & shares:</div>
                  {participants.map((p, idx) => (
                    <div key={idx} className="flex justify-between py-0.5">
                      <span>{p.name} — {p.weight}kg</span>
                      <span className="font-medium">₹{((p.weight / totalWeight) * price.total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Price Breakdown Card */}
          <div className="bg-gray-800 text-white rounded-xl p-5 md:p-6 h-fit md:sticky md:top-6">
            <h2 className="text-lg font-semibold mb-4">
              <Receipt size={18} className="inline mr-2 text-amber-500" />
              Price Breakdown
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Distance charge</span>
                <span>₹{price.distCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Goods surcharge</span>
                <span>₹{price.surcharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Driver fee</span>
                <span>₹{price.driverFee.toFixed(2)}</span>
              </div>
              <div className="border-t my-2 border-gray-700"></div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total trip cost</span>
                <span>₹{price.total.toFixed(2)}</span>
              </div>
              
              {mode === 'shared' && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Your weight share</span>
                    <span>{price.weightShare.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-1 text-amber-500">
                    <span>You pay</span>
                    <span>₹{price.youPay.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showModal && modalDetails && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                <CheckCircle size={18} className="inline mr-2 text-green-600" />
                Booking Confirmed
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Booking type</span><span className="font-medium">{modalDetails.modeLabel}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Route</span><span className="font-medium">{modalDetails.pickup} → {modalDetails.dropoff}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-medium">{modalDetails.vehicle}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Distance</span><span className="font-medium">{modalDetails.distance} km</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Weight</span><span className="font-medium">{modalDetails.weight} kg</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Pickup time</span><span className="font-medium">{new Date(modalDetails.date).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Booked by</span><span className="font-medium">{modalDetails.userName} ({modalDetails.phone})</span></div>
              <div className="border-t my-2 border-gray-200"></div>
              <div className="flex justify-between text-base font-bold"><span>Total trip cost</span><span className="text-gray-800">₹{modalDetails.total.toFixed(2)}</span></div>
              {modalDetails.youPay && (
                <div className="flex justify-between text-base font-bold mt-1"><span>You pay</span><span className="text-gray-800">₹{modalDetails.youPay.toFixed(2)}</span></div>
              )}
            </div>
            <button onClick={() => setShowModal(false)} className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 rounded-lg transition">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for steering wheel icon
const SteeringWheel = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </svg>
);

export default transportbooking;
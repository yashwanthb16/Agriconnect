import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Machinery',
    'Marketplace',
    'Storage',
    'Transport',
    'Learning',
    'Insurance',
    'Community',
  ];

  const machinery = [
    { name: 'Tractor', price: '₹1000/hour', owner: 'Rajesh Kumar', distance: '2.5 km', available: true, icon: '🚜' },
    { name: 'Harvester', price: '₹2000/hour', owner: 'Suresh Patel', distance: '4.2 km', available: true, icon: '🌾' },
    { name: 'Rotavator', price: '₹1500/hour', owner: 'Mahesh Singh', distance: '1.8 km', available: false, icon: '⚙️' },
    { name: 'Seed Drill', price: '₹750/hour', owner: 'Ramesh Yadav', distance: '3.1 km', available: true, icon: '🌱' },
    { name: 'Sprayer Machine', price: '₹250/hour', owner: 'Dinesh Kumar', distance: '2.0 km', available: true, icon: '💦' },
  ];

  const fertilizers = [
    { name: 'Organic Compost', price: '₹750/bag', seller: 'Green Earth', stock: 'In Stock', delivery: 'Yes', icon: '🌿' },
    { name: 'Urea Fertilizer', price: '₹780/bag', seller: 'Agro Solutions', stock: 'In Stock', delivery: 'Yes', icon: '💊' },
    { name: 'Hybrid Seeds', price: '₹1000/kg', seller: 'Seed Corp', stock: 'Limited', delivery: 'Yes', icon: '🌱' },
    { name: 'Bio Pesticide', price: '₹950/liter', seller: 'Bio Farm', stock: 'In Stock', delivery: 'No', icon: '🛡️' },
    { name: 'NPK Fertilizer', price: '₹1000/bag', seller: 'Farm Inputs', stock: 'In Stock', delivery: 'Yes', icon: '🧪' },
  ];

  const storage = [
    { name: 'Central Warehouse', distance: '3.5 km', price: '₹100/day', capacity: '500 tons', icon: '🏭' },
    { name: 'Cold Storage Unit', distance: '5.2 km', price: '₹300/day', capacity: '200 tons', icon: '❄️' },
    { name: 'Village Godown', distance: '1.8 km', price: '₹75/day', capacity: '100 tons', icon: '🏪' },
    { name: 'Modern Cold Storage', distance: '7.1 km', price: '₹1500/day', capacity: '300 tons', icon: '🧊' },
  ];

  const transport = [
    { truckId: 'KA-01-AB-1234', destination: 'Bangalore Market', capacity: '40%', cropType: 'Vegetables', costShare: '₹800', icon: '🚛' },
    { truckId: 'KA-02-CD-5678', destination: 'Mysore Mandi', capacity: '65%', cropType: 'Grains', costShare: '₹1200', icon: '🚚' },
    { truckId: 'KA-03-EF-9012', destination: 'Chennai Port', capacity: '25%', cropType: 'Fruits', costShare: '₹2500', icon: '🚛' },
  ];

  const buyerRequests = [
    { buyer: 'Metro Retail', product: 'Onion', quantity: '500 kg', price: '₹35/kg', location: 'Bangalore', icon: '🧅' },
    { buyer: 'Fresh Mart', product: 'Tomato', quantity: '300 kg', price: '₹40/kg', location: 'Mysore', icon: '🍅' },
    { buyer: 'Organic Hub', product: 'Rice', quantity: '1000 kg', price: '₹45/kg', location: 'Chennai', icon: '🌾' },
  ];

  const learning = [
    { technique: 'Drip Irrigation', crops: 'Vegetables, Fruits', description: 'Water-efficient irrigation system', icon: '💧' },
    { technique: 'Sprinkler System', crops: 'Grains, Pulses', description: 'Uniform water distribution', icon: '⛲' },
    { technique: 'Hydroponics', crops: 'Leafy Greens, Herbs', description: 'Soilless farming technique', icon: '🌿' },
    { technique: 'Organic Farming', crops: 'All Crops', description: 'Chemical-free cultivation', icon: '🍃' },
    { technique: 'Precision Farming', crops: 'Cash Crops', description: 'Technology-driven farming', icon: '🎯' },
    { technique: 'Crop Rotation', crops: 'Seasonal Crops', description: 'Maintain soil fertility', icon: '🔄' },
  ];

  const organicWaste = [
    { type: 'Coconut Fiber', quantity: '2 tons', location: 'Kerala', usage: 'Compost, Mulching', icon: '🥥' },
    { type: 'Crop Waste', quantity: '5 tons', location: 'Punjab', usage: 'Biofuel', icon: '🌾' },
    { type: 'Sugarcane Waste', quantity: '3 tons', location: 'UP', usage: 'Paper, Fuel', icon: '🎋' },
    { type: 'Paddy Husk', quantity: '4 tons', location: 'Tamil Nadu', usage: 'Mushroom, Fuel', icon: '🌾' },
  ];

  const poultryAnalytics = [
    { product: 'Eggs', demand: 'High', price: '₹6/piece', hotels: 45, trend: '↑ 12%', icon: '🥚' },
    { product: 'Chicken', demand: 'Medium', price: '₹180/kg', hotels: 32, trend: '↑ 8%', icon: '🍗' },
    { product: 'Broiler', demand: 'High', price: '₹160/kg', hotels: 38, trend: '↑ 15%', icon: '🐔' },
  ];

  const insurance = [
    { type: 'Crop Insurance', premium: '₹2500/year', coverage: 'Up to ₹2 Lakhs', icon: '🌾' },
    { type: 'Poultry Insurance', premium: '₹1800/year', coverage: 'Up to ₹50,000', icon: '🐔' },
    { type: 'Livestock Insurance', premium: '₹3000/year', coverage: 'Up to ₹1 Lakh', icon: '🐄' },
    { type: 'Transport Insurance', premium: '₹1500/year', coverage: 'Up to ₹3 Lakhs', icon: '🚛' },
  ];

  const services = [
    { 
      name: 'Machinery Rental', 
      icon: '🚜', 
      category: 'Machinery',
      bgImage: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c10?w=400&q=80'
    },
    { 
      name: 'Fertilizer Marketplace', 
      icon: '🧪', 
      category: 'Marketplace',
      bgImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80'
    },
    { 
      name: 'Storage Service', 
      icon: '🏭', 
      category: 'Storage',
      bgImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80'
    },
    { 
      name: 'Smart Transport', 
      icon: '🚛', 
      category: 'Transport',
      bgImage: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&q=80'
    },
    { 
      name: 'Buyer Connection', 
      icon: '🤝', 
      category: 'Marketplace',
      bgImage: 'https://images.unsplash.com/photo-1530857842417-5e12a7f6b5ec?w=400&q=80'
    },
    { 
      name: 'Learning Center', 
      icon: '📚', 
      category: 'Learning',
      bgImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80'
    },
    { 
      name: 'Waste Exchange', 
      icon: '♻️', 
      category: 'Marketplace',
      bgImage: 'https://images.unsplash.com/photo-1416339376390-497b25f89a82?w=400&q=80'
    },
    { 
      name: 'Poultry Analytics', 
      icon: '📊', 
      category: 'Marketplace',
      bgImage: 'https://images.unsplash.com/photo-1506259091721-347e791bab0f?w=400&q=80'
    },
    { 
      name: 'Micro Insurance', 
      icon: '🛡️', 
      category: 'Insurance',
      bgImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80'
    },
    { 
      name: 'Group Selling', 
      icon: '👥', 
      category: 'Community',
      bgImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&q=80'
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80)',
            }}
          />
          
          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Farmer Services</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto drop-shadow">
              Complete digital platform providing all essential services farmers need - from machinery rental to market access
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg mb-6"
            />
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Service Overview Cards */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {filteredServices.map((service, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer text-center overflow-hidden group"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundImage: `url(${service.bgImage})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">{service.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 1. Machinery Rental Service */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🚜</span>
              <h2 className="text-3xl font-bold text-gray-900">Machinery Rental Service</h2>
            </div>
            <p className="text-gray-600 mb-6">Rent agricultural machines at affordable prices from nearby owners</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {machinery.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-green-600">{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner:</span>
                      <span className="font-medium text-gray-900">{item.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium text-gray-900">{item.distance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      item.available
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!item.available}
                  >
                    {item.available ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Fertilizer Marketplace */}
        <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🧪</span>
              <h2 className="text-3xl font-bold text-gray-900">Fertilizer & Crop Input Marketplace</h2>
            </div>
            <p className="text-gray-600 mb-6">Quality agricultural inputs from verified sellers</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fertilizers.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-green-600">{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seller:</span>
                      <span className="font-medium text-gray-900">{item.seller}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.stock === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.stock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-medium text-gray-900">{item.delivery}</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Storage Service */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🏭</span>
              <h2 className="text-3xl font-bold text-gray-900">Nearby Storage & Cold Storage</h2>
            </div>
            <p className="text-gray-600 mb-6">Find temporary storage facilities near your farm</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {storage.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Distance:</span>
                      <span className="font-semibold text-gray-900">{item.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Price:</span>
                      <span className="font-bold text-green-600">{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Capacity:</span>
                      <span className="font-medium text-gray-900">{item.capacity}</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                    Reserve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Smart Transport Service */}
        <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🚛</span>
              <h2 className="text-3xl font-bold text-gray-900">Smart Transport - Cost Sharing</h2>
            </div>
            <p className="text-gray-600 mb-6">Share truck capacity with other farmers and save on transport costs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transport.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.truckId}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-semibold text-gray-900">{item.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-bold text-green-600">{item.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crop Type:</span>
                      <span className="font-medium text-gray-900">{item.cropType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Share:</span>
                      <span className="font-bold text-orange-600">{item.costShare}</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all">
                    Book Space
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Buyer Connection */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🤝</span>
              <h2 className="text-3xl font-bold text-gray-900">Buyer & Intermediary Connection</h2>
            </div>
            <p className="text-gray-600 mb-6">Connect directly with buyers and negotiate better prices</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyerRequests.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.buyer}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-semibold text-gray-900">{item.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-bold text-purple-600">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-green-600">{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">{item.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
                      Accept Deal
                    </button>
                    <button className="flex-1 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Learning Center */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">📚</span>
              <h2 className="text-3xl font-bold text-gray-900">Modern Farming Learning Center</h2>
            </div>
            <p className="text-gray-600 mb-6">Learn modern farming techniques to increase productivity</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learning.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.technique}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{item.description}</p>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Suitable Crops:</span>
                    <p className="font-medium text-gray-900">{item.crops}</p>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Organic Waste Exchange */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">♻️</span>
              <h2 className="text-3xl font-bold text-gray-900">Organic Waste Exchange</h2>
            </div>
            <p className="text-gray-600 mb-6">Turn agricultural waste into valuable resources</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {organicWaste.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.type}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Quantity:</span>
                      <span className="font-bold text-green-600">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Location:</span>
                      <span className="font-medium text-gray-900">{item.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Usage:</span>
                      <p className="font-medium text-gray-900 text-sm">{item.usage}</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
                    Contact
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Poultry Analytics */}
        <section className="py-12 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">📊</span>
              <h2 className="text-3xl font-bold text-gray-900">Poultry Demand Analytics</h2>
            </div>
            <p className="text-gray-600 mb-6">Real-time market demand insights for poultry products</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {poultryAnalytics.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.product}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Demand:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.demand === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.demand}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-green-600">{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hotels:</span>
                      <span className="font-medium text-gray-900">{item.hotels} nearby</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trend:</span>
                      <span className="font-bold text-green-600">{item.trend}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: item.demand === 'High' ? '90%' : '60%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Micro Insurance */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🛡️</span>
              <h2 className="text-3xl font-bold text-gray-900">Micro Insurance Service</h2>
            </div>
            <p className="text-gray-600 mb-6">Affordable insurance plans to protect your farming business</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {insurance.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.type}</h3>
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-gray-600 text-sm">Premium:</span>
                      <p className="font-bold text-orange-600 text-lg">{item.premium}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Coverage:</span>
                      <p className="font-bold text-green-600 text-lg">{item.coverage}</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Group Selling Platform */}
        <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">👥</span>
              <h2 className="text-3xl font-bold text-gray-900">Farmer Group Selling Platform</h2>
            </div>
            <p className="text-gray-600 mb-6">Join forces with other farmers and sell together for better prices</p>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-5xl mb-3">👨‍🌾</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">150+</h3>
                  <p className="text-gray-600">Active Groups</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-5xl mb-3">📦</div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">5000+ tons</h3>
                  <p className="text-gray-600">Combined Quantity</p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl">
                  <div className="text-5xl mb-3">🏢</div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">80+</h3>
                  <p className="text-gray-600">Corporate Buyers</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">Combine small quantities with other farmers</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">Attract large corporate buyers</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">Negotiate better prices together</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">✓</span>
                  <span className="text-gray-700">Increase bargaining power</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg">
                  Join a Group
                </button>
                <button className="flex-1 py-4 border-2 border-green-600 text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition-all">
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Services;

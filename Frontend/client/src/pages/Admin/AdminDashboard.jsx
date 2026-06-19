import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeToggleInline as ThemeToggle } from '../../components/ThemeToggle';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
const UPLOAD_BASE = 'http://localhost:5000';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'drivers', label: 'Drivers', icon: '🚗' },
  { id: 'users', label: 'Users', icon: '👥' },
];

const DOC_LABELS = {
  driverLicenseFront: { label: 'Driving License (Front)', icon: '🪪' },
  driverLicenseBack: { label: 'Driving License (Back)', icon: '🪪' },
  identityProof: { label: 'Identity Proof (Aadhaar/PAN)', icon: '🆔' },
  profilePhoto: { label: 'Profile Photo', icon: '📷' },
  vehicleRC: { label: 'Vehicle RC', icon: '📄' },
  insuranceCertificate: { label: 'Insurance Certificate', icon: '🛡️' },
  pucCertificate: { label: 'PUC Certificate', icon: '🌿' },
  fitnessCertificate: { label: 'Fitness Certificate', icon: '✅' },
  permitCertificate: { label: 'Permit Certificate', icon: '📋' },
  medicalFitness: { label: 'Medical Fitness', icon: '🏥' },
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverFilter, setDriverFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
  if (!adminUser || adminUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">You need admin privileges to access this page.</p>
          <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Go to Login</button>
        </div>
      </div>
    );
  }

  const fetchStats = async () => {
    try {
      const res = await API.get('/auth/dashboard-stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await API.get('/transport', { params: driverFilter ? { status: driverFilter } : {} });
      setDrivers(res.data.data || []);
    } catch (err) {
      console.error('Drivers error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Users error:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchDrivers(), fetchUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [driverFilter]);

  const handleApprove = async (driverId) => {
    try {
      await API.put(`/transport/admin/approve/${driverId}`);
      fetchDrivers();
      fetchStats();
    } catch (err) {
      alert('Failed to approve driver');
    }
  };

  const handleReject = async (driverId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await API.put(`/transport/admin/reject/${driverId}`, { reason });
      fetchDrivers();
      fetchStats();
    } catch (err) {
      alert('Failed to reject driver');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const openDriverDetail = (driver) => {
    setSelectedDriver(driver);
    setShowDocModal(true);
  };

  const closeDocModal = () => {
    setShowDocModal(false);
    setSelectedDriver(null);
    setPreviewDoc(null);
  };

  const openPreview = (docKey) => {
    const docUrl = selectedDriver?.documents?.[docKey];
    if (docUrl) {
      setPreviewDoc({ key: docKey, url: `${UPLOAD_BASE}${docUrl}` });
    }
  };

  const getDocUrl = (docPath) => {
    if (!docPath) return null;
    if (docPath.startsWith('http')) return docPath;
    return `${UPLOAD_BASE}${docPath}`;
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
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const roleBadge = (role) => {
    const colors = {
      farmer: 'bg-green-100 text-green-700',
      buyer: 'bg-blue-100 text-blue-700',
      storage_owner: 'bg-purple-100 text-purple-700',
      admin: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
        {role.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const availBadge = (isAvailable) => {
    return isAvailable ? (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">🟢 Available</span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">🔴 Not Available</span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">A</div>
          {sidebarOpen && <div><div className="font-bold text-sm">AgriConnect</div><div className="text-xs text-slate-400">Admin Panel</div></div>}
        </div>

        <nav className="flex-1 py-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-all ${
                activeTab === tab.id ? 'bg-green-600/20 text-green-400 border-r-2 border-green-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full px-4 py-2 flex items-center gap-3 text-sm text-red-400 hover:bg-red-900/30 rounded-lg transition">
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{adminUser?.name || 'Admin'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{adminUser?.email}</div>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              {(adminUser?.name || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats.users.total} icon="👥" color="bg-blue-500" subtext={`Farmers: ${stats.users.farmers} | Buyers: ${stats.users.buyers}`} />
                <StatCard title="Total Drivers" value={stats.drivers.total} icon="🚗" color="bg-green-500" subtext={`Approved: ${stats.drivers.approved} | Draft: ${stats.drivers.draft}`} />
                <StatCard title="Pending Reviews" value={stats.drivers.pending} icon="⏳" color="bg-yellow-500" subtext="Drivers awaiting approval" />
                <StatCard title="Rejected" value={stats.drivers.rejected} icon="❌" color="bg-red-500" subtext="Rejected driver applications" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-bold text-gray-800 mb-4">👥 Recent Users</h3>
                  <div className="space-y-3">
                    {stats.recentUsers.map((user) => (
                      <div key={user._id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        {roleBadge(user.role)}
                      </div>
                    ))}
                    {stats.recentUsers.length === 0 && <p className="text-sm text-gray-400">No users yet</p>}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-bold text-gray-800 mb-4">🚗 Recent Drivers</h3>
                  <div className="space-y-3">
                    {stats.recentDrivers.map((driver) => (
                      <div key={driver._id} className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2" onClick={() => openDriverDetail(driver)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                            {driver.driverProfile?.fullName?.[0]?.toUpperCase() || 'D'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{driver.driverProfile?.fullName || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{driver.driverProfile?.email || 'No email'}</div>
                          </div>
                        </div>
                        {statusBadge(driver.status)}
                      </div>
                    ))}
                    {stats.recentDrivers.length === 0 && <p className="text-sm text-gray-400">No drivers yet</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-800 mb-4">📊 User Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <BreakdownBar label="Farmers" count={stats.users.farmers} total={stats.users.total} color="bg-green-500" />
                  <BreakdownBar label="Buyers" count={stats.users.buyers} total={stats.users.total} color="bg-blue-500" />
                  <BreakdownBar label="Storage Owners" count={stats.users.storageOwners} total={stats.users.total} color="bg-purple-500" />
                  <BreakdownBar label="Drivers" count={stats.drivers.total} total={stats.users.total + stats.drivers.total} color="bg-yellow-500" />
                </div>
              </div>
            </div>
          )}

          {/* Drivers Tab */}
          {activeTab === 'drivers' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Filter by Status:</span>
                {['', 'draft', 'submitted', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setDriverFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      driverFilter === status ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === '' ? 'All' : status.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
                <span className="ml-auto text-sm text-gray-500">{drivers.length} drivers found</span>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Driver</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Vehicle</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Availability</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Trips</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Registered</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map((driver) => (
                        <tr key={driver._id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{driver.driverProfile?.fullName || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{driver.registrationId || 'No Reg ID'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-700">{driver.driverProfile?.email || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{driver.driverProfile?.mobile || ''}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-700">{driver.vehicleDetails?.vehicleType || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{driver.vehicleDetails?.registrationNumber || ''}</div>
                          </td>
                          <td className="px-4 py-3">{statusBadge(driver.status)}</td>
                          <td className="px-4 py-3">
                            {driver.status === 'approved' ? (
                              <div>
                                {availBadge(driver.verification?.isAvailable)}
                                {driver.verification?.isAvailable && driver.availabilityDetails && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {driver.availabilityDetails.fromLocation || ''} → {driver.availabilityDetails.toLocation || ''}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-700">{driver.totalTrips || 0} trips</div>
                            <div className="text-xs text-green-600 font-semibold">₹{(driver.totalEarnings || 0).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(driver.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 flex-wrap">
                              <button onClick={() => openDriverDetail(driver)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">View Details</button>
                              {driver.status === 'submitted' && (
                                <>
                                  <button onClick={() => handleApprove(driver._id)} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition">Approve</button>
                                  <button onClick={() => handleReject(driver._id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition">Reject</button>
                                </>
                              )}
                              {driver.status === 'approved' && (
                                <span className="text-green-600 text-xs font-semibold">✓ Approved</span>
                              )}
                              {driver.status === 'rejected' && (
                                <div>
                                  <span className="text-red-600 text-xs font-semibold">✗ Rejected</span>
                                  {driver.rejectionReason && <div className="text-xs text-gray-400 mt-1">Reason: {driver.rejectionReason}</div>}
                                </div>
                              )}
                              {driver.status === 'draft' && (
                                <span className="text-gray-400 text-xs">Draft - awaiting submission</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {drivers.length === 0 && (
                        <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400">No drivers found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{user.email}</td>
                        <td className="px-4 py-3">{roleBadge(user.role)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== DRIVER DETAIL & DOCUMENTS MODAL ===== */}
      {showDocModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeDocModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                  {selectedDriver.driverProfile?.fullName?.[0]?.toUpperCase() || 'D'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedDriver.driverProfile?.fullName || 'Unknown Driver'}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{selectedDriver.driverProfile?.email}</span>
                    <span>·</span>
                    {statusBadge(selectedDriver.status)}
                  </div>
                </div>
              </div>
              <button onClick={closeDocModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 text-lg">✕</button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Driver Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Profile Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">👤 Driver Profile</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Full Name" value={selectedDriver.driverProfile?.fullName} />
                    <InfoRow label="Date of Birth" value={selectedDriver.driverProfile?.dateOfBirth ? new Date(selectedDriver.driverProfile.dateOfBirth).toLocaleDateString() : ''} />
                    <InfoRow label="Gender" value={selectedDriver.driverProfile?.gender} />
                    <InfoRow label="Mobile" value={selectedDriver.driverProfile?.mobile} />
                    <InfoRow label="Email" value={selectedDriver.driverProfile?.email} />
                    <InfoRow label="Permanent Address" value={selectedDriver.driverProfile?.permanentAddress} />
                    <InfoRow label="National ID" value={`${selectedDriver.driverProfile?.nationalIdType?.toUpperCase()}: ${selectedDriver.driverProfile?.nationalId}`} />
                  </div>
                </div>

                {/* License Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">🪪 License Details</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="License Number" value={selectedDriver.licenseDetails?.licenseNumber} />
                    <InfoRow label="Issuing RTO" value={selectedDriver.licenseDetails?.licenseIssuingRTO} />
                    <InfoRow label="Issue Date" value={selectedDriver.licenseDetails?.licenseIssueDate ? new Date(selectedDriver.licenseDetails.licenseIssueDate).toLocaleDateString() : ''} />
                    <InfoRow label="Expiry Date" value={selectedDriver.licenseDetails?.licenseExpiryDate ? new Date(selectedDriver.licenseDetails.licenseExpiryDate).toLocaleDateString() : ''} />
                    <InfoRow label="Class" value={selectedDriver.licenseDetails?.licenseClass} />
                    <InfoRow label="Experience" value={`${selectedDriver.licenseDetails?.drivingExperienceYears || 0} years`} />
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">🚗 Vehicle Details</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Type" value={selectedDriver.vehicleDetails?.vehicleType} />
                    <InfoRow label="Make / Model" value={`${selectedDriver.vehicleDetails?.make || ''} ${selectedDriver.vehicleDetails?.model || ''}`} />
                    <InfoRow label="Year" value={selectedDriver.vehicleDetails?.yearOfManufacture} />
                    <InfoRow label="Registration No." value={selectedDriver.vehicleDetails?.registrationNumber} />
                    <InfoRow label="Fuel Type" value={selectedDriver.vehicleDetails?.fuelType} />
                    <InfoRow label="Seating Capacity" value={selectedDriver.vehicleDetails?.seatingCapacity} />
                    <InfoRow label="VIN/Chassis" value={selectedDriver.vehicleDetails?.vinChassis} />
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">✅ Verification Status</h3>
                  <div className="space-y-3">
                    <VerifyBadge label="Mobile Verified" verified={selectedDriver.verification?.mobileVerified} />
                    <VerifyBadge label="Email Verified" verified={selectedDriver.verification?.emailVerified} />
                    <VerifyBadge label="Documents Verified" verified={selectedDriver.verification?.documentsVerified} />
                    <VerifyBadge label="Admin Approved" verified={selectedDriver.verification?.adminApproved} />
                  </div>
                  {selectedDriver.registrationId && (
                    <div className="mt-3 pt-3 border-t">
                      <InfoRow label="Registration ID" value={selectedDriver.registrationId} />
                    </div>
                  )}
                  {selectedDriver.rejectionReason && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-red-600 font-semibold">Rejection Reason:</div>
                      <div className="text-sm text-red-500 mt-1">{selectedDriver.rejectionReason}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== DOCUMENTS SECTION ===== */}
              <div className="mt-2">
                <h3 className="font-bold text-gray-800 mb-4 text-base">📎 Uploaded Documents</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(DOC_LABELS).map(([key, { label, icon }]) => {
                    const docUrl = selectedDriver.documents?.[key];
                    const fullUrl = getDocUrl(docUrl);
                    return (
                      <div
                        key={key}
                        onClick={() => fullUrl ? openPreview(key) : null}
                        className={`rounded-xl border-2 p-4 text-center transition ${
                          fullUrl
                            ? 'border-green-200 bg-green-50 cursor-pointer hover:border-green-400 hover:shadow-md'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{icon}</div>
                        <div className="text-xs font-semibold text-gray-700 leading-tight mb-2">{label}</div>
                        {fullUrl ? (
                          <span className="inline-block px-2 py-1 bg-green-600 text-white rounded text-[10px] font-bold">VIEW</span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-gray-300 text-gray-600 rounded text-[10px] font-bold">NOT UPLOADED</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between flex-shrink-0">
              <div className="text-sm text-gray-500">
                Registered: {new Date(selectedDriver.createdAt).toLocaleString()}
              </div>
              <div className="flex gap-2">
                {selectedDriver.status === 'submitted' && (
                  <>
                    <button onClick={() => { handleApprove(selectedDriver._id); closeDocModal(); }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">Approve</button>
                    <button onClick={() => { handleReject(selectedDriver._id); closeDocModal(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">Reject</button>
                  </>
                )}
                <button onClick={closeDocModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DOCUMENT PREVIEW MODAL ===== */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800 text-sm">
                {DOC_LABELS[previewDoc.key]?.icon} {DOC_LABELS[previewDoc.key]?.label || previewDoc.key}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Open in New Tab
                </a>
                <button onClick={() => setPreviewDoc(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 text-lg">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 p-4 min-h-[400px]">
              {/* Check if it's likely an image or PDF */}
              {previewDoc.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
                <img
                  src={previewDoc.url}
                  alt={DOC_LABELS[previewDoc.key]?.label}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
              ) : previewDoc.url.match(/\.pdf$/i) ? (
                <iframe
                  src={previewDoc.url}
                  className="w-full h-[70vh] rounded-lg border-0"
                  title={DOC_LABELS[previewDoc.key]?.label}
                />
              ) : (
                /* For unknown types, try image first, fall back to iframe */
                <>
                  <img
                    src={previewDoc.url}
                    alt={DOC_LABELS[previewDoc.key]?.label}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div style={{ display: 'none' }} className="flex-col items-center gap-4">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-gray-600 text-sm">Preview not available for this file type.</p>
                    <a href={previewDoc.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 mt-2">Download / Open File</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, subtext }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl text-white`}>
          {icon}
        </div>
      </div>
      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
    </div>
  );
}

function BreakdownBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-800 font-bold">{count}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
      </div>
      <div className="text-xs text-gray-400 mt-1">{pct.toFixed(1)}%</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-gray-800 font-medium text-right truncate">{value || 'N/A'}</span>
    </div>
  );
}

function VerifyBadge({ label, verified }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
        {verified ? '✓ Verified' : '✗ Not Verified'}
      </span>
    </div>
  );
}

export default AdminDashboard;

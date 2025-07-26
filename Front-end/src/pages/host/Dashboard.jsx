import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApiUrl } from '../../config/api';

export default function HostDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    availableVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login to access host dashboard');
      navigate('/login');
      return;
    }
    fetchHostData();
  }, [navigate]);

  const fetchHostData = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const userId = localStorage.getItem('userId');

    console.log('🔍 Fetching host data for user:', userId);
    console.log('🔑 Token exists:', !!token);

    try {
      // Fetch host vehicles
      const vehiclesResponse = await fetch(getApiUrl(`api/user/user/${userId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📡 Vehicles API response status:', vehiclesResponse.status);

      if (vehiclesResponse.ok) {
        const vehiclesData = await vehiclesResponse.json();
        console.log('✅ Vehicles API response:', vehiclesData);
        const vehiclesList = vehiclesData.data || vehiclesData || [];
        console.log('🚗 Processed vehicles list:', vehiclesList);
        setVehicles(vehiclesList);
        
        // Calculate analytics
        const totalVehicles = vehiclesList.length;
        const activeVehicles = vehiclesList.filter(v => v.isActive).length;
        const availableVehicles = vehiclesList.filter(v => v.isActive && v.isAvailable !== false).length;
        
        setAnalytics(prev => ({
          ...prev,
          totalVehicles,
          activeVehicles,
          availableVehicles
        }));
      } else {
        const errorText = await vehiclesResponse.text();
        console.error('❌ Vehicles API error:', vehiclesResponse.status, errorText);
        toast.error('Failed to load vehicles');
      }

      // Fetch bookings for host vehicles (if endpoint exists)
      try {
        const bookingsResponse = await fetch(getApiUrl(`api/bookings/host/${userId}`), {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('📋 Bookings API response status:', bookingsResponse.status);

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          console.log('✅ Bookings API response:', bookingsData);
          const bookingsList = Array.isArray(bookingsData.data) ? bookingsData.data : [];
          console.log('📋 Processed bookings list:', bookingsList);
          setBookings(bookingsList);
          
          // Calculate booking analytics
          const totalBookings = bookingsList.length;
          const completedBookings = bookingsList.filter(b => b.bookingStatus === 'completed').length;
          const pendingBookings = bookingsList.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending').length;
          const totalRevenue = bookingsList
            .filter(b => b.bookingStatus === 'completed')
            .reduce((sum, b) => sum + (b.pricing?.totalAmount || b.totalAmount || 0), 0);

          setAnalytics(prev => ({
            ...prev,
            totalBookings,
            completedBookings,
            pendingBookings,
            totalRevenue
          }));
        } else {
          const errorText = await bookingsResponse.text();
          console.error('❌ Bookings API error:', bookingsResponse.status, errorText);
          // Don't show error for bookings since it might not be implemented
          console.log('ℹ️ Bookings endpoint not available, continuing without booking data');
        }
      } catch (bookingError) {
        console.log('Bookings endpoint not available:', bookingError);
        // Continue without bookings data
      }

    } catch (error) {
      console.error('Error fetching host data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleAvailability = async (vehicleId, currentAvailability) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const userId = localStorage.getItem('userId');
    
    console.log('🔍 Frontend - User ID:', userId);
    console.log('🔍 Frontend - Vehicle ID:', vehicleId);
    console.log('🔍 Frontend - Current Availability:', currentAvailability);
    
    try {
      const response = await fetch(getApiUrl(`api/vehicles/${vehicleId}/availability`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !currentAvailability })
      });

      if (response.ok) {
        toast.success(`Vehicle ${!currentAvailability ? 'made available' : 'made unavailable'} successfully`);
        fetchHostData(); // Refresh data
      } else {
        const errorData = await response.json();
        console.error('❌ Frontend - API Error:', errorData);
        toast.error(errorData.message || 'Failed to update vehicle availability');
      }
    } catch (error) {
      console.error('Error toggling vehicle availability:', error);
      toast.error('Failed to update vehicle availability');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-vehicle.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return getApiUrl(`uploads/vehicles/${imagePath}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your vehicles and track your earnings</p>
            </div>
            <button
              onClick={() => navigate('/add-vehicle')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalVehicles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeVehicles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.availableVehicles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'vehicles', name: 'My Vehicles', icon: '🚗' },
                { id: 'bookings', name: 'Bookings', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                
                {/* Recent Bookings */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Bookings</h4>
                  {bookings.slice(0, 3).length > 0 ? (
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking._id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {booking.vehicleName || booking.vehicleId?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                by {booking.userName || booking.userId?.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(booking.pricing?.totalAmount || booking.totalAmount || 0)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(booking.paymentDate || booking.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No bookings yet</p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-800">Completed Bookings</h4>
                    <p className="text-2xl font-bold text-green-900">{analytics.completedBookings}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-medium text-yellow-800">Pending Bookings</h4>
                    <p className="text-2xl font-bold text-yellow-900">{analytics.pendingBookings}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-800">Average Revenue</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {analytics.completedBookings > 0 
                        ? formatCurrency(analytics.totalRevenue / analytics.completedBookings)
                        : formatCurrency(0)
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">My Vehicles</h3>
                  <button
                    onClick={() => navigate('/add-vehicle')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Add New Vehicle
                  </button>
                </div>

                {vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={getImageUrl(vehicle.image)}
                            alt={vehicle.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                            <div className="flex flex-col gap-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                vehicle.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {vehicle.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                vehicle.isAvailable !== false 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {vehicle.isAvailable !== false ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{vehicle.brand} • {vehicle.type}</p>
                          <p className="font-bold text-blue-600 mb-3">{formatCurrency(vehicle.price)}/day</p>
                          
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleVehicleAvailability(vehicle._id, vehicle.isAvailable)}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                                vehicle.isAvailable !== false
                                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              {vehicle.isAvailable !== false ? 'Make Unavailable' : 'Make Available'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-500 mb-4">You haven't added any vehicles yet</p>
                    <button
                      onClick={() => navigate('/add-vehicle')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Add Your First Vehicle
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                
                {bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img 
                                    className="h-10 w-10 rounded-full object-cover" 
                                    src={getImageUrl(booking.vehicleImage || booking.vehicleId?.image)} 
                                    alt={booking.vehicleName || booking.vehicleId?.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.vehicleName || booking.vehicleId?.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.vehicleModel || booking.vehicleType || booking.vehicleId?.type}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.userName || booking.userId?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.userEmail || booking.userId?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>{formatDate(booking.startDate)}</div>
                              <div className="text-gray-500">to {formatDate(booking.endDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(booking.pricing?.totalAmount || booking.totalAmount || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.bookingStatus === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : booking.bookingStatus === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : booking.bookingStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.bookingStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

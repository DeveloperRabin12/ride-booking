import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RiderDataContext } from '../context/RiderContext'
import axios from 'axios'

const RiderDetails = ({ onlineTime = 0 }) => {
  const { rider } = useContext(RiderDataContext)
  const [stats, setStats] = useState({
    today: {
      rides: 0,
      earnings: 0,
      distance: 0
    },
    allTime: {
      rides: 0,
      earnings: 0,
      distance: 0
    },
    trends: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshMessage, setRefreshMessage] = useState('')

  // Debug: Log rider data to see what's available
  console.log('RiderDetails - Full rider data:', rider);
  console.log('RiderDetails - Full name:', rider?.fullname?.firstname);
  console.log('RiderDetails - First name:', rider?.fullname?.firstname);
  console.log('RiderDetails - Last name:', rider?.fullname?.lastname);

  // Fetch real stats from backend
  const fetchStats = async (showLoading = true) => {
    if (!rider?._id) return;

    try {
      if (showLoading) setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found, skipping stats fetch');
        return;
      }

      const response = await axios.get(`http://localhost:4000/riders/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Stats fetched successfully:', response.data);

      // Ensure all stats have proper default values
      const safeStats = {
        today: {
          rides: response.data?.today?.rides || 0,
          earnings: response.data?.today?.earnings || 0,
          distance: response.data?.today?.distance || 0
        },
        allTime: {
          rides: response.data?.allTime?.rides || 0,
          earnings: response.data?.allTime?.earnings || 0,
          distance: response.data?.allTime?.distance || 0
        },
        trends: response.data?.trends || []
      };

      setStats(safeStats);
      setError(null);
      setLastUpdated(new Date());

      if (showLoading) {
        setRefreshMessage('Stats updated successfully!');
        setTimeout(() => setRefreshMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error fetching rider stats:', error);
      setError('Failed to load statistics');

      // Fallback to default stats if API fails
      setStats({
        today: { rides: 0, earnings: 0, distance: 0 },
        allTime: { rides: 0, earnings: 0, distance: 0 },
        trends: []
      });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchStats(true);
  };

  // useEffect for initial load and auto-refresh
  useEffect(() => {
    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(() => fetchStats(false), 5 * 60 * 1000);

    // Also refresh stats when component becomes visible (for real-time updates)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [rider?._id]);

  // Format online time
  const formatOnlineTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get display name with better fallback logic
  const getDisplayName = () => {
    if (rider?.fullname?.firstname) {
      return rider.fullname.firstname;
    }
    if (rider?.fullname?.lastname) {
      return rider.fullname.lastname;
    }
    if (rider?.name) {
      return rider.name;
    }
    if (rider?.email) {
      return rider.email.split('@')[0]; // Use part before @ in email
    }
    return 'Rider';
  };

  const displayName = getDisplayName();

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'RS 0';
    return `RS ${Number(amount).toLocaleString()}`;
  };

  // Format distance
  const formatDistance = (km) => {
    if (km === undefined || km === null) return '0.0 km';
    return `${Number(km).toFixed(1)} km`;
  };

  // Calculate percentage change for trends
  const getPercentageChange = (current, previous) => {
    const safeCurrent = Number(current) || 0;
    const safePrevious = Number(previous) || 0;

    if (safePrevious === 0) return safeCurrent > 0 ? 100 : 0;
    return Math.round(((safeCurrent - safePrevious) / safePrevious) * 100);
  };

  // Get yesterday's stats for comparison
  const getYesterdayStats = () => {
    if (!stats.trends || stats.trends.length < 2) {
      return { rides: 0, earnings: 0, distance: 0 };
    }
    const yesterdayData = stats.trends[stats.trends.length - 2];
    return {
      rides: yesterdayData?.rides || 0,
      earnings: yesterdayData?.earnings || 0,
      distance: yesterdayData?.distance || 0
    };
  };

  const yesterdayStats = getYesterdayStats();

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <i className="ri-user-3-fill text-xl text-white"></i>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Rider Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back, {displayName}!</p>
          </div>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <i className="ri-logout-box-r-line"></i>
          <span>Logout</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Notification Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <i className="ri-information-line text-blue-500 text-xl"></i>
            <div className="flex-1">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> After completing a ride, use the refresh button above to update your stats immediately.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh Now'}
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <i className="ri-user-3-fill text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-600 text-lg">You're now available for ride requests</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Current Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Available</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <i className="ri-time-line text-2xl text-green-500 mb-2"></i>
              <p className="text-sm text-gray-600">Online Time</p>
              <p className="text-lg font-bold text-green-600">{formatOnlineTime(onlineTime)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <i className="ri-map-pin-line text-2xl text-blue-500 mb-2"></i>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-lg font-bold text-blue-600">Active</p>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Today's Stats</h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh stats"
              >
                <i className={`ri-refresh-line text-lg ${loading ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-xl animate-pulse">
                  <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded mx-auto mb-1"></div>
                  <div className="w-12 h-6 bg-gray-300 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">
              <i className="ri-error-warning-line text-2xl mb-2"></i>
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <i className="ri-route-line text-2xl text-yellow-500 mb-2"></i>
                <p className="text-sm text-gray-600">Rides</p>
                <p className="text-lg font-bold text-yellow-600">{stats?.today?.rides || 0}</p>
                <p className="text-xs text-yellow-600">
                  {getPercentageChange(stats?.today?.rides, yesterdayStats.rides) > 0 ? '+' : ''}
                  {getPercentageChange(stats?.today?.rides, yesterdayStats.rides)}% from yesterday
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <i className="ri-money-dollar-circle-line text-2xl text-purple-500 mb-2"></i>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(stats?.today?.earnings)}</p>
                <p className="text-xs text-purple-600">
                  {getPercentageChange(stats?.today?.earnings, yesterdayStats.earnings) > 0 ? '+' : ''}
                  {getPercentageChange(stats?.today?.earnings, yesterdayStats.earnings)}% from yesterday
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <i className="ri-speed-line text-2xl text-red-500 mb-2"></i>
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-lg font-bold text-red-600">{formatDistance(stats?.today?.distance)}</p>
                <p className="text-xs text-red-600">
                  {getPercentageChange(stats?.today?.distance, yesterdayStats.distance) > 0 ? '+' : ''}
                  {getPercentageChange(stats?.today?.distance, yesterdayStats.distance)}% from yesterday
                </p>
              </div>
            </div>
          )}

          {/* Last Updated Info */}
          {lastUpdated && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Last updated: {lastUpdated.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
          )}

          {/* Success Message */}
          {refreshMessage && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center flex items-center justify-center gap-2">
                <i className="ri-check-line"></i>
                {refreshMessage}
              </p>
            </div>
          )}
        </div>

        {/* All Time Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">All Time Stats</h2>
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-xl animate-pulse">
                  <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded mx-auto mb-1"></div>
                  <div className="w-12 h-6 bg-gray-300 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <i className="ri-route-line text-2xl text-indigo-500 mb-2"></i>
                <p className="text-sm text-gray-600">Total Rides</p>
                <p className="text-lg font-bold text-indigo-600">{stats?.allTime?.rides || 0}</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <i className="ri-money-dollar-circle-line text-2xl text-emerald-500 mb-2"></i>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats?.allTime?.earnings)}</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                <i className="ri-speed-line text-2xl text-orange-500 mb-2"></i>
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-lg font-bold text-orange-600">{formatDistance(stats?.allTime?.distance)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Info */}
        {rider?.vehicle && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-car-line text-xl text-blue-500"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800 capitalize">{rider.vehicle.vehicleType}</p>
                  <p className="text-sm text-gray-600">{rider.vehicle.color} • {rider.vehicle.numberPlate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium text-green-600">Ready</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/rider/profile"
              className="w-full p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
            >
              <i className="ri-settings-3-line"></i>
              <span>Update Profile</span>
            </Link>
            <Link
              to="/rider/history"
              className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
            >
              <i className="ri-history-line"></i>
              <span>View History</span>
            </Link>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>You'll receive ride requests automatically when they come in</p>
          <p className="mt-1">Keep the app open to stay available</p>
        </div>
      </div>
    </div>
  )
}

export default RiderDetails
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { RiderDataContext } from '../context/RiderContext'

const RiderDetails = ({ onlineTime = 0 }) => {
  const { rider } = useContext(RiderDataContext)

  // Debug: Log rider data to see what's available
  console.log('RiderDetails - Full rider data:', rider);
  console.log('RiderDetails - Full name:', rider?.fullname);
  console.log('RiderDetails - First name:', rider?.fullname?.firstname);
  console.log('RiderDetails - Last name:', rider?.fullname?.lastname);

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

        {/* Stats Cards */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <i className="ri-route-line text-2xl text-yellow-500 mb-2"></i>
              <p className="text-sm text-gray-600">Rides</p>
              <p className="text-lg font-bold text-yellow-600">0</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <i className="ri-money-dollar-circle-line text-2xl text-purple-500 mb-2"></i>
              <p className="text-sm text-gray-600">Earnings</p>
              <p className="text-lg font-bold text-purple-600">RS 0</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <i className="ri-speed-line text-2xl text-red-500 mb-2"></i>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-lg font-bold text-red-600">0 km</p>
            </div>
          </div>
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
                  <p className="text-sm text-gray-600">{rider.vehicle.color} • {rider.vehicle.vehiclePlate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium text-gray-800">Ready</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-3">
              <i className="ri-settings-3-line"></i>
              <span>Update Profile</span>
            </button>
            <button className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3">
              <i className="ri-history-line"></i>
              <span>View History</span>
            </button>
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
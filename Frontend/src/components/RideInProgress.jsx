import React from 'react'

const RideInProgress = ({ rideData }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">🚗</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ride in Progress</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Driver:</span>
            <span className="font-medium">{rideData?.riderName || 'Rider'}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{rideData?.pickup || 'Pickup'}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{rideData?.destination || 'Destination'}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">ETA:</span>
            <span className="font-medium">{rideData?.estimatedTime || '5-10 mins'}</span>
          </div>
        </div>
        
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
          <p className="text-sm">Your driver is on the way. Please wait at the pickup location.</p>
        </div>
      </div>
    </div>
  )
}

export default RideInProgress

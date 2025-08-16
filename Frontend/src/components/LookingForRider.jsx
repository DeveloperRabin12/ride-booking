import React from 'react'

const LookingForRider = ({ pickup, destination, fare, vehicleType }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-yellow-50 p-6">
      <div className="text-center max-w-md">
        <h3 className='text-3xl font-bold mb-6 text-yellow-800'>🔍 Looking for Rider</h3>

        {/* Loading Animation */}
        <div className='mb-8'>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500"></div>
          </div>
          <p className="text-yellow-600 font-medium">Searching for nearby riders...</p>
        </div>

        {/* Ride Details */}
        <div className='w-full space-y-4'>
          {/* Pickup */}
          <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white'>
            <i className="text-xl ri-map-pin-2-fill text-green-500"></i>
            <div className='flex-1 text-left'>
              <h3 className='text-sm font-semibold text-gray-500'>PICKUP</h3>
              <p className='text-base font-medium text-gray-800'>{pickup || 'Unknown location'}</p>
            </div>
          </div>

          {/* Destination */}
          <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white'>
            <i className="text-xl ri-map-pin-2-fill text-red-500"></i>
            <div className='flex-1 text-left'>
              <h3 className='text-sm font-semibold text-gray-500'>DESTINATION</h3>
              <p className='text-base font-medium text-gray-800'>{destination || 'Unknown destination'}</p>
            </div>
          </div>

          {/* Fare */}
          <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white'>
            <i className="text-xl ri-bank-card-2-fill text-blue-500"></i>
            <div className='flex-1 text-left'>
              <h3 className='text-sm font-semibold text-gray-500'>ESTIMATED FARE</h3>
              <p className='text-lg font-bold text-green-600'>RS {fare?.[vehicleType] || '0'}</p>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white'>
            <i className="text-xl ri-car-line text-purple-500"></i>
            <div className='flex-1 text-left'>
              <h3 className='text-sm font-semibold text-gray-500'>VEHICLE</h3>
              <p className='text-base font-medium text-gray-800 capitalize'>{vehicleType || 'Any'}</p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
          <div className="text-yellow-800">
            <i className="ri-information-line text-2xl mb-2"></i>
            <p className="font-semibold">Please wait...</p>
            <p className="text-sm">We're finding the best rider for you</p>
          </div>
        </div>

        {/* Cancel Button */}
        <button className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          ❌ Cancel Request
        </button>
      </div>
    </div>
  )
}

export default LookingForRider
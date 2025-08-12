import React from 'react'

const WaitingForRider = ({ rideData, onStart }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="text-center max-w-md">
        <h3 className='text-3xl font-bold mb-6 text-blue-800'>⏳ Waiting for Passenger</h3>

        {/* Passenger Info */}
        <div className='flex items-center justify-between bg-white p-4 rounded-lg mb-6 shadow-md'>
          <img
            className='h-16 w-16 rounded-full object-cover'
            src="https://imgs.search.brave.com/I_vRdrr9JtvB71WasZbqU05tw2l7mYOOyRvcwtAShEU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcv/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Ymx1ZS1jaXJjbGUt/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MCZxPTgw"
            alt="Passenger"
          />
          <div className='text-right'>
            <h2 className='text-lg font-semibold text-gray-800'>{rideData?.user?.name || 'Unknown'}</h2>
            <p className='text-sm text-gray-500'>Passenger</p>
            <p className='text-xs text-gray-400'>Ready to pickup</p>
          </div>
        </div>

        {/* Ride Details */}
        <div className='w-full space-y-4'>
          {/* Pickup */}
          <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white'>
            <i className="text-xl ri-map-pin-2-fill text-green-500"></i>
            <div className='flex-1 text-left'>
              <h3 className='text-sm font-semibold text-gray-500'>PICKUP</h3>
              <p className='text-base font-medium text-gray-800'>{rideData?.pickup?.address || 'Unknown location'}</p>
            </div>
          </div>

          {/* Destination */}
          <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white'>
            <i className="text-xl ri-map-pin-2-fill text-red-500"></i>
            <div className='flex-1 text-left'>
              <h3 className='text-sm font-semibold text-gray-500'>DESTINATION</h3>
              <p className='text-base font-medium text-gray-800'>{rideData?.destination?.address || 'Unknown destination'}</p>
            </div>
          </div>

          {/* Fare */}
          <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white'>
            <i className="text-xl ri-bank-card-2-fill text-blue-500"></i>
            <div className='flex-1 text-left'>
              <h3 className='text-sm font-semibold text-gray-500'>ESTIMATED FARE</h3>
              <p className='text-lg font-bold text-green-600'>RS {rideData?.estimatedFare || '0'}</p>
            </div>
          </div>
        </div>

        {/* Start Ride Button */}
        <button
          onClick={onStart}
          className='mt-8 w-full bg-blue-600 text-white font-semibold p-4 rounded-lg hover:bg-blue-700 transition-colors text-lg'
        >
          🚀 Start Ride
        </button>

        <p className='text-sm text-gray-500 mt-4'>
          Head to the pickup location to start the ride
        </p>
      </div>
    </div>
  )
}

export default WaitingForRider
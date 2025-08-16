import React from 'react'

const RidePopUp = ({ rideData, onAccept, onReject }) => {
    console.log('RidePopUp props:', { rideData, onAccept, onReject });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <h5 onClick={onReject} className='p-2 text-center font-bold text-2xl text-gray-600 cursor-pointer hover:text-gray-800'>
                    <i className="ri-arrow-down-wide-line"></i>
                </h5>
                
                <h3 className='text-3xl font-bold mb-3 text-center'>🚗 New Ride Request</h3>

                {/* User Info */}
                <div className='flex items-center justify-between p-3 bg-yellow-100 rounded-lg mt-4'>
                    <div className='flex items-center gap-3'>
                        <img 
                            className='h-12 w-12 rounded-full object-cover' 
                            src="https://imgs.search.brave.com/I_vRdrr9JtvB71WasZbqU05tw2l7mYOOyRvcwtAShEU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcv/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Ymx1ZS1jaXJjbGUt/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MCZxPTgw" 
                            alt="User" 
                        />
                        <div>
                            <h2 className='text-xl font-medium'>{rideData?.user?.name || 'Unknown User'}</h2>
                            <p className='text-sm text-gray-600'>Passenger</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <h5 className='text-lg font-semibold text-blue-600'>
                            {rideData?.distance ? `${rideData.distance.toFixed(1)} KM` : 'Nearby'}
                        </h5>
                        <p className='text-sm text-gray-500'>Distance</p>
                    </div>
                </div>
                
                {/* Ride Details */}
                <div className='w-full mt-5 space-y-3'>
                    {/* Pickup */}
                    <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg'>
                        <i className="text-xl ri-map-pin-2-fill text-green-500"></i>
                        <div className='flex-1'>
                            <h3 className='text-sm font-semibold text-gray-500'>PICKUP</h3>
                            <p className='text-base font-medium text-gray-800'>{rideData?.pickup?.address || 'Unknown location'}</p>
                        </div>
                    </div>
                    
                    {/* Destination */}
                    <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg'>
                        <i className="text-xl ri-map-pin-2-fill text-red-500"></i>
                        <div className='flex-1'>
                            <h3 className='text-sm font-semibold text-gray-500'>DESTINATION</h3>
                            <p className='text-base font-medium text-gray-800'>{rideData?.destination?.address || 'Unknown destination'}</p>
                        </div>
                    </div>
                    
                    {/* Fare */}
                    <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg'>
                        <i className="text-xl ri-bank-card-2-fill text-blue-500"></i>
                        <div className='flex-1'>
                            <h3 className='text-sm font-semibold text-gray-500'>ESTIMATED FARE</h3>
                            <p className='text-lg font-bold text-green-600'>RS {rideData?.estimatedFare || '0'}</p>
                        </div>
                    </div>
                    
                    {/* Vehicle Type */}
                    <div className='flex items-center gap-4 p-3 border border-gray-200 rounded-lg'>
                        <i className="text-xl ri-car-line text-purple-500"></i>
                        <div className='flex-1'>
                            <h3 className='text-sm font-semibold text-gray-500'>VEHICLE</h3>
                            <p className='text-base font-medium text-gray-800 capitalize'>{rideData?.vehicleType || 'Any'}</p>
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className='flex gap-3 mt-6'>
                    <button 
                        onClick={onAccept}
                        className='flex-1 bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition-colors'
                    >
                        ✅ Accept Ride
                    </button>
                    <button 
                        onClick={onReject}
                        className='flex-1 bg-gray-500 text-white font-semibold p-3 rounded-lg hover:bg-gray-600 transition-colors'
                    >
                        ❌ Decline
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp
import React from 'react'

const FinishRide = ({ rideData, onReset }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-green-50 p-6">
            <div className="text-center max-w-md">
                <h3 className='text-3xl font-bold mb-6 text-green-800'>🏁 Ride Completed!</h3>

                {/* Passenger Info */}
                <div className='flex items-center justify-between p-3 bg-green-100 rounded-lg mt-4 mb-6'>
                    <div className='flex items-center gap-4'>
                        <img
                            className='h-12 w-12 rounded-full object-cover'
                            src="https://imgs.search.brave.com/I_vRdrr9JtvB71WasZbqU05tw2l7mYOOyRvcwtAShEU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcv/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MCZxPTgw"
                            alt="Passenger"
                        />
                        <h2 className='text-xl font-medium text-gray-800'>{rideData?.user?.name || 'Unknown'}</h2>
                    </div>
                    <div className='text-right'>
                        <h5 className='text-lg font-semibold text-green-600'>
                            {rideData?.distance ? `${rideData.distance.toFixed(1)} KM` : 'Completed'}
                        </h5>
                        <p className='text-sm text-gray-500'>Distance</p>
                    </div>
                </div>

                {/* Ride Summary */}
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
                            <h3 className='text-sm font-semibold text-gray-500'>FINAL FARE</h3>
                            <p className='text-lg font-bold text-green-600'>RS {rideData?.estimatedFare || '0'}</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className='mt-6 p-4 bg-green-100 rounded-lg'>
                    <div className='text-green-800'>
                        <i className="ri-check-circle-line text-2xl mb-2"></i>
                        <p className='font-semibold'>Ride completed successfully!</p>
                        <p className='text-sm'>Payment received and passenger dropped off safely.</p>
                    </div>
                </div>

                {/* Reset Button */}
                <button
                    onClick={onReset}
                    className='mt-6 w-full bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition-colors'
                >
                    🔄 Back to Available
                </button>

                <p className='text-sm text-gray-500 mt-4'>
                    You're now available for new ride requests
                </p>
            </div>
        </div>
    )
}

export default FinishRide
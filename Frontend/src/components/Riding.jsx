import React from 'react';

const Riding = ({ rideData, onFinish }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-blue-50 p-6">
            <div className="text-center">
                <div className="mb-6">
                    <i className="ri-car-line text-8xl text-blue-500"></i>
                </div>

                <h2 className="text-3xl font-bold text-blue-800 mb-4">
                    🚗 Ride in Progress
                </h2>

                <div className="bg-white rounded-lg p-6 shadow-md max-w-md mx-auto">
                    <div className="space-y-3 text-left">
                        <div>
                            <span className="font-semibold text-gray-700">Passenger:</span>
                            <span className="ml-2 text-gray-900">
                                {rideData?.user?.name || 'Unknown'}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700">From:</span>
                            <span className="ml-2 text-gray-900">
                                {rideData?.pickup?.address || 'Unknown location'}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700">To:</span>
                            <span className="ml-2 text-gray-900">
                                {rideData?.destination?.address || 'Unknown destination'}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700">Vehicle:</span>
                            <span className="ml-2 text-gray-900 capitalize">
                                {rideData?.vehicleType || 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onFinish}
                    className="mt-8 px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
                >
                    🏁 Finish Ride
                </button>
            </div>
        </div>
    );
};

export default Riding;

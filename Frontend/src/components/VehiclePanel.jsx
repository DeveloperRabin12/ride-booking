import React from 'react'

const VehiclePanel = (props) => {
   const { availableRiders = [], fare = {} } = props;

   // Filter riders by vehicle type
   const bikeRiders = availableRiders.filter(rider => rider.vehicleType === 'bike');
   const carRiders = availableRiders.filter(rider => rider.vehicleType === 'car');

   // Get the closest rider for each type
   const closestBikeRider = bikeRiders.length > 0 ? bikeRiders[0] : null;
   const closestCarRider = carRiders.length > 0 ? carRiders[0] : null;

   // Check if any riders are available
   const hasAnyRiders = availableRiders.length > 0;

   return (
      <div>
         <h5 onClick={() => {
            props.setVehiclePanel(false)
         }} className='p-2 text-center font-bold text-2xl bg-transparent-500 absolute top-0'>
            <i className="ri-arrow-down-wide-line"></i>
         </h5>

         <h3 className='text-3xl font-bold mb-3'>Choose Your Ride</h3>

         {!hasAnyRiders ? (
            // No riders available message
            <div className='text-center py-8'>
               <div className='mb-4'>
                  <i className="ri-car-line text-6xl text-gray-400"></i>
               </div>
               <h4 className='text-xl font-semibold text-gray-600 mb-2'>No Riders Available</h4>
               <p className='text-gray-500 mb-4'>We couldn\'t find any riders in your area right now.</p>
               <div className='space-y-2 text-sm text-gray-600'>
                  <p>• Try increasing the search radius</p>
                  <p>• Check back in a few minutes</p>
                  <p>• Make sure you\'re in a populated area</p>
               </div>
               <button
                  onClick={() => props.setVehiclePanel(false)}
                  className='mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
               >
                  Try Again
               </button>
            </div>
         ) : (
            // Show available ride options
            <div className='space-y-4'>
               {/* Bike Option */}
               {closestBikeRider && (
                  <div onClick={() => {
                     props.setConfirmedVehicle(true)
                     props.setVehicleType('bike')
                  }} className='flex w-full p-3 border-2 border-green-200 rounded-xl items-center justify-between hover:border-green-400 cursor-pointer transition-colors'>
                     <img className='h-12' src="https://imgs.search.brave.com/sbgrgn3yB5O_KqrLgoxGDJHvi3xD0AAlh7Sa7alX5is/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vYUFSMzFo/azVRczRNN0NjcVF4/N25PSTY3Y2lCNkFF/b3ZlNlIwZGZHeVFZ/cy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkw/TkM1bS9kR05rYmk1/dVpYUXZhbkJuL0x6/QXpMekU1THpBNUx6/QTEvTHpNMk1GOUdY/ek14T1RBNS9NRFV5/TkY5U00yVjRiM1ZS/L2RIUllTMFZ3TlZO/eU5XaHkvVG5WeFFY/bHhaVEZuY1RSby9O/eTVxY0dj" alt="Bike" />
                     <div className='w-1/2 px-4 py-2'>
                        <h4 className='font-bold text-lg text-green-800'>
                           {closestBikeRider.name}
                           <span><i className="ri-user-3-fill ml-2"></i></span>
                        </h4>
                        <h4 className='font-medium text-sm text-green-600'>
                           {closestBikeRider.estimatedTime} away
                        </h4>
                        <p className='text-xs text-green-500'>
                           {closestBikeRider.vehicleColor} • {closestBikeRider.vehiclePlate}
                        </p>
                     </div>
                     <h2 className='text-2xl font-bold text-green-800'>RS.{fare.bike || 0}</h2>
                  </div>
               )}

               {/* Car Option */}
               {closestCarRider && (
                  <div onClick={() => {
                     props.setVehiclePanel(false)
                     props.setVehicleType('car')
                  }} className='flex w-full p-3 border-2 border-blue-200 rounded-xl items-center justify-between hover:border-blue-400 cursor-pointer transition-colors'>
                     <img className='h-12' src="https://imgs.search.brave.com/sbgrgn3yB5O_KqrLgoxGDJHvi3xD0AAlh7Sa7alX5is/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vYUFSMzFo/azVRczRNN0NjcVF4/N25PSTY3Y2lCNkFF/b3ZlNlIwZGZHeVFZ/cy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkw/TkM1bS9kR05rYmk1/dVpYUXZhbkJuL0x6/QXpMekU1THpBNUx6/QTEvTHpNMk1GOUdY/ek14T1RBNS9NRFV5/TkY5U00yVjRiM1ZS/L2RIUllTMFZ3TlZO/eU5XaHkvVG5WeFFY/bHhaVEZuY1RSby9O/eTVxY0dj" alt="Car" />
                     <div className='w-1/2 px-4 py-2'>
                        <h4 className='font-bold text-lg text-blue-800'>
                           {closestCarRider.name}
                           <span><i className="ri-user-3-fill ml-2"></i></span>
                        </h4>
                        <h4 className='font-medium text-sm text-blue-600'>
                           {closestCarRider.estimatedTime} away
                        </h4>
                        <p className='text-xs text-blue-500'>
                           {closestCarRider.vehicleColor} • {closestCarRider.vehiclePlate}
                        </p>
                     </div>
                     <h2 className='text-2xl font-bold text-blue-800'>RS.{fare.car || 0}</h2>
                  </div>
               )}

               {/* Show message if no riders of a specific type */}
               {!closestBikeRider && !closestCarRider && (
                  <div className='text-center py-4 text-gray-500'>
                     <p>No riders available for the selected vehicle types</p>
                  </div>
               )}
            </div>
         )}
      </div>
   )
}

export default VehiclePanel
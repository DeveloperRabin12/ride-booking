import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
         <h5 onClick={()=>{
              props.setVehiclePanel(false)
           }} className='p-2 text-center font-bold text-2xl bg-transparent-500 absolute top-0'><i className="ri-arrow-down-wide-line"></i></h5>
           <h3 className='text-3xl font-bold mb-3'> choose Your Rides</h3>
           <div onClick={()=>{
            props.setConfirmedVehicle(true)
            props.setVehicleType('bike')
           }} className='flex w-full p-3 my-2 border-2 active:border-black rounded-xl items-center justify-between'>
              <img className='h-12' src="https://imgs.search.brave.com/sbgrgn3yB5O_KqrLgoxGDJHvi3xD0AAlh7Sa7alX5is/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vYUFSMzFo/azVRczRNN0NjcVF4/N25PSTY3Y2lCNkFF/b3ZlNlIwZGZHeVFZ/cy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkw/TkM1bS9kR05rYmk1/dVpYUXZhbkJuL0x6/QXpMekU1THpBNUx6/QTEvTHpNMk1GOUdY/ek14T1RBNS9NRFV5/TkY5U00yVjRiM1ZS/L2RIUllTMFZ3TlZO/eU5XaHkvVG5WeFFY/bHhaVEZuY1RSby9O/eTVxY0dj" alt=""  />
              <div className=' w-1/2 px-4 py-2'>
                <h4 className='font-bold text-lg'>Rider 1 <span><i className="ri-user-3-fill"></i></span></h4>
                <h4 className='font-medium text-sm text-gray-600'>2 mins away</h4>
              </div>
              <h2 className='text-2xl font-bold'>RS.{props.fare.bike}</h2>
           </div>

           <div onClick={()=>{
              props.setVehiclePanel(false)
              props.setVehicleType('car')
           }} className='flex w-full p-3 my-2 border-2 active:border-black rounded-xl items-center justify-between'>
              <img className='h-12' src="https://imgs.search.brave.com/sbgrgn3yB5O_KqrLgoxGDJHvi3xD0AAlh7Sa7alX5is/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vYUFSMzFo/azVRczRNN0NjcVF4/N25PSTY3Y2lCNkFF/b3ZlNlIwZGZHeVFZ/cy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkw/TkM1bS9kR05rYmk1/dVpYUXZhbkJuL0x6/QXpMekU1THpBNUx6/QTEvTHpNMk1GOUdY/ek14T1RBNS9NRFV5/TkY5U00yVjRiM1ZS/L2RIUllTMFZ3TlZO/eU5XaHkvVG5WeFFY/bHhaVEZuY1RSby9O/eTVxY0dj" alt=""  />
              <div className=' w-1/2 px-4 py-2'>
                <h4 className='font-bold text-lg'>Rider 1 <span><i className="ri-user-3-fill"></i></span></h4>
                <h4 className='font-medium text-sm text-gray-600'>2 mins away</h4>
              </div>
              <h2 className='text-2xl font-bold'>RS.{props.fare.car}</h2>
           </div>

           {/* <div onClick={()=>{
              props.setVehiclePanel(false)
           }} className='flex w-full p-3 my-2 border-2 active:border-black rounded-xl items-center justify-between'>
              <img className='h-12' src="https://imgs.search.brave.com/sbgrgn3yB5O_KqrLgoxGDJHvi3xD0AAlh7Sa7alX5is/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vYUFSMzFo/azVRczRNN0NjcVF4/N25PSTY3Y2lCNkFF/b3ZlNlIwZGZHeVFZ/cy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkw/TkM1bS9kR05rYmk1/dVpYUXZhbkJuL0x6/QXpMekU1THpBNUx6/QTEvTHpNMk1GOUdY/ek14T1RBNS9NRFV5/TkY5U00yVjRiM1ZS/L2RIUllTMFZ3TlZO/eU5XaHkvVG5WeFFY/bHhaVEZuY1RSby9O/eTVxY0dj" alt=""  />
              <div className=' w-1/2 px-4 py-2'>
                <h4 className='font-bold text-lg'>Rider 1 <span><i className="ri-user-3-fill"></i></span></h4>
                <h4 className='font-medium text-sm text-gray-600'>2 mins away</h4>
              </div>
              <h2 className='text-2xl font-bold'>Rs{props.fare.car}</h2>
           </div> */}
    </div>
  )
}

export default VehiclePanel
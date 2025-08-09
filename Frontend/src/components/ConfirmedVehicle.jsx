import React from 'react'

const ConfirmedVehicle = (props) => {
  return (
    <div className='h-screen'>
        <h5 onClick={()=>{
              props.setConfirmedVehicle(false)
           }} className='p-2 text-center font-bold text-2xl bg-transparent-500  top-0'><i className="ri-arrow-down-wide-line"></i></h5>
           <h3 className='text-3xl font-bold mb-3'> Confirm Your Rides</h3>
           
           <div className='flex gap-3 flex-col items-center'>
                <img className='h-20' src="https://imgs.search.brave.com/zF46EQt6YVAbeIs-aC8fjxWIhQQf5rjYjzNOsdlROZI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL3ByZW1p/dW0vdGh1bWIvYXN0/cm9uYXV0LXJpZGlu/Zy1iaWtlLTNkLWls/bHVzdHJhdGlvbi1k/b3dubG9hZC1pbi1w/bmctYmxlbmQtZmJ4/LWdsdGYtZmlsZS1m/b3JtYXRzLS1jb3Nt/b3MtZmxvYXRpbmct/Zmx5aW5nLW1hc2Nv/dC1wbGFuZXQtcGFj/ay1zY2llbmNlLXRl/Y2hub2xvZ3ktaWxs/dXN0cmF0aW9ucy05/ODkwNzIzLnBuZz9m/PXdlYnA" alt="" />
           
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-t-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div >
                            <h3 className='text-lg font-bold'>pickup</h3>
                            <p className='-mt-1 text-base font-semibold text-gray-700'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-t-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div >
                            <h3 className='text-lg font-bold'>Drop</h3>
                            <p className='-mt-1 text-base font-semibold text-gray-700'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-t-2'>
                        <i className="ri-bank-card-2-fill"></i>
                        <div >
                            <h3 className='text-lg font-bold'>RS {props.fare[props.vehicleType]}</h3>
                            <p className='-mt-1 text-base font-semibold text-gray-700'>cash price</p>
                        </div>
                    </div>
                    <button onClick={()=>{
                        props.setVehicleFound(true)
                        props.setConfirmedVehicle(false)
                        props.createRide()
                    }} className='mt-5 w-full bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>
                </div>
           </div>

          
    </div>
  )
}

export default ConfirmedVehicle
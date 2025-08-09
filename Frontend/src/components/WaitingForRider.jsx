import React from 'react'

const WaitingForRider = (props) => {
  console.log(props)
  return (
     <div>
       <h5 onClick={()=>{
              props.WaitingForRider(false)
           }} className='p-2 text-center font-bold text-2xl bg-transparent-500  top-0'><i className="ri-arrow-down-wide-line"></i></h5>
           
            <div className='flex items-center justify-between'>
              <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
              <div className='text-right'>
                <h2 className='text-lg font-semibold'>bikas</h2>
                <h4 className='text-xl font-semibold -mt-1 -mb-1'>Ba 8 pa 8795</h4>
                <p className='text-sm text-gray-500'>bike</p>
                <h1 className='text-sm font-bold'></h1>
              </div>
            </div>

           <div className='flex gap-3 flex-col items-center'>
                         
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-t-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div >
                            <h3 className='text-lg font-bold'>56344</h3>
                            <p className='-mt-1 text-base font-semibold text-gray-700'>bhaktapur</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-t-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div >
                            <h3 className='text-lg font-bold'>56344</h3>
                            <p className='-mt-1 text-base font-semibold text-gray-700'>kathmandu</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-t-2'>
                        <i className="ri-bank-card-2-fill"></i>
                        <div >
                            <h3 className='text-lg font-bold'>RS 158</h3>
                            <p className='-mt-1 text-base font-semibold text-gray-700'>Cash</p>
                        </div>
                    </div>
                    
                </div>
           </div>
 
    </div>
  )
}

export default WaitingForRider
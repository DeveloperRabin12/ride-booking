import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {

    const [otp, setOtp] = useState('')
    const submitHandler = (e)=>{
            e.preventDefault()
    }
  return (
    <div>
            <h5 onClick={()=>{
              props.setRidePopUpPanel(false)
           }} className='p-2 text-center font-bold text-2xl bg-transparent-500  top-0'><i className="ri-arrow-down-wide-line"></i></h5>
           <h3 className='text-3xl font-bold mb-3'> Confirm the Ride?</h3>

           <div className='flex items-center justify-between p-3 bg-yellow-300 rounded-lg mt-4'>
                <div className='flex items-center gap-5 '>
                    <img className='h-12 w-12 rounded-full object-cover' src="https://imgs.search.brave.com/I_vRdrr9JtvB71WasZbqU05tw2l7mYOOyRvcwtAShEU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Ymx1ZS1jaXJjbGUt/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MCZxPTgw" alt="" />
                    <h2 className='text-xl font-medium'>Sanil</h2>              
                </div>
                <h5 className='text-lg font-semibold'>7 KM</h5>
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
                    
                    

                    <div className='mt-6 w-full'>
                            <form onSubmit={(e)=>{
                                submitHandler(e)
                            }}>
                                <input value={otp} onChange={(e)=>setOtp(e.target.value)} className='bg-[#eee] px-6 py-2 rounded-lg text-lg mt-4 w-full' type="text"  placeholder='otp'/>
                                <Link to='/rider-riding' className='mt-5  w-full flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'>Confirm</Link>

                                 <button onClick={()=>{
                                 props.setConfirmRidePopUpPanel(false)
                                  props.setRidePopUpPanel(false)
                                 }} className='mt-5 w-full bg-red-500 text-white font-semibold p-3 rounded-lg'>Cancel</button>
                            </form>
                    </div>
                </div>
           </div>

    </div>
  )
}

export default ConfirmRidePopUp
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const RiderRiding = () => {

const [finishRidePanel, setFinishRidePanel] = useState(false)
const finishRidePanelRef = useRef(null)


 useGSAP(function() {
      if(finishRidePanel){
         gsap.to(finishRidePanelRef.current,{
         transform: 'translateY(0)',
    })
      }else{
        gsap.to(finishRidePanelRef.current,{
         transform: 'translateY(100%)',
        })
      }
   

  }, [finishRidePanel])

  return (
         
          <div className='h-screen'>
                       
                      <div className='fixed p-6 top-0 flex items-center justify-between w-full'>
                         <img className='w-16' src="" alt="" />
                         <Link to='/home' className='fixed  h-12 w-12  top-7 bg-slate-100 flex right-4 items-center justify-center rounded-full '>
                         <i className="text-2xl ri-logout-box-r-line"></i>
                        </Link>
                      </div>
          
                      <div className='h-4/5 '>
                         <img className=' h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
                      </div>

                    <div className='h-1/5 px-3 bg-yellow-400 flex items-center relative justify-between ' 
                    onClick={()=>{
                        setFinishRidePanel(true)
                    }}>
                          <h5  className='p-2 text-center w-full  text-xl absolute  top-0'><i className="ri-arrow-down-wide-line"></i></h5>
                         <h4 className='text-xl '>4 mins away</h4>
                         <button className='  bg-green-600 text-white font-semibold p-3 px-6 rounded-lg'>Finish Ride</button>
                    </div>

                    <div ref={finishRidePanelRef} className='fixed z-10 translate-y-full h-screen bottom-0 bg-white p-3 w-full'>
                        <FinishRide setFinishRidePanel={setFinishRidePanel}/>
                   </div>
                   
          </div>  
          
  
  )
}

export default RiderRiding
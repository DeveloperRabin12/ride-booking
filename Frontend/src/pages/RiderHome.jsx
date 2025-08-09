import React from 'react'
import { data, Link } from 'react-router-dom'
import { useState,useRef } from 'react'
import axios from 'axios'
import riderimg from '/src/assets/images/rider.png'
import RiderDetails from '../components/RiderDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'
import { RiderDataContext } from '../context/RiderContext'
import { useContext } from 'react'




const RiderHome = () => {


  const ridePopUpPanelRef = useRef(null)
  const confirmRidePopUpPanelRef = useRef(null)


  const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const [ ride, setRide ] = useState(null)

  const{socket } = useContext(SocketContext)
  const { rider, setRider } = useContext(RiderDataContext)

  // Load rider data if not already loaded
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!rider && token) {
      axios.get(`http://localhost:4000/riders/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        if (response.status === 200) {
          console.log('Rider data loaded:', response.data)
          setRider(response.data)
        }
      }).catch(error => {
        console.error('Failed to load rider data:', error)
      })
    }
  }, [rider, setRider])

  useEffect(() => {
    console.log('RiderHome useEffect - socket:', !!socket, 'rider:', rider)
    
    if (!socket || !rider?._id) {
      console.log('Missing socket or rider data:', { socket: !!socket, riderId: rider?._id })
      return;
    }

    console.log('Joining socket room with rider ID:', rider._id)
    socket.emit('join',{
      userId : rider._id,
      userType: 'rider'
    })

    // Handle new ride events
    const handleNewRide = (data) => {
      console.log('🚗 New ride received:', data)
      setRide(data)
      setRidePopUpPanel(true)
    }

    console.log('Setting up new-ride listener')
    socket.on('new-ride', handleNewRide)

     const updateLocation = () => {
           if (!rider || !rider._id) return;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    socket.emit('update-location-rider', {
                        userId: rider._id,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                     console.log("📍 Location sent:", position.coords.latitude, position.coords.longitude)
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 50000); // Update every 50 seconds
       updateLocation(); // Initial call to set location immediately
       
        return () => {
            socket.off('new-ride', handleNewRide);
            clearInterval(locationInterval);
        }
},[socket, rider?._id])


async function confirmRide(){
  const response = await axios.post(`http://localhost:4000/rides/confirm`,{
    rideId: ride._id,
    riderId: rider._id

  }
  ,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
   setRidePopUpPanel(false)
        setConfirmRidePopUpPanel(true)

}







  useGSAP(function() {
      if(ridePopUpPanel){
         gsap.to(ridePopUpPanelRef.current,{
         transform: 'translateY(0)',
    })
      }else{
        gsap.to(ridePopUpPanelRef.current,{
         transform: 'translateY(100%)',
        })
      }
   

  }, [ridePopUpPanel])

  useGSAP(function() {
      if(confirmRidePopUpPanel){
         gsap.to(confirmRidePopUpPanelRef.current,{
         transform: 'translateY(0)',
    })
      }else{
        gsap.to(confirmRidePopUpPanelRef.current,{
         transform: 'translateY(100%)',
        })
      }
   
  }, [confirmRidePopUpPanel])

  return (
    <div>

          <div className='h-screen '>
            
                      <div className='fixed p-6 top-0 flex items-center justify-between w-full'>
                         <img className='w-16' src={riderimg} alt="" />
                         <Link to='/home' className='fixed  h-12 w-12  top-7 bg-slate-100 flex right-4 items-center justify-center rounded-full '>
                         <i className="text-2xl ri-logout-box-r-line"></i>
                        </Link>
                      </div>
          
                      <div className='h-3/5 '>
                         <img className=' h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
                      </div>

                    <div className='h-2/5 p-4 mt-6 '>
                         <RiderDetails/>
                    </div>

                    <div ref={ridePopUpPanelRef} className='fixed z-10 translate-y-full  bottom-0 bg-white p-3 w-full'>
                        <RidePopUp 
                        ride={ride}
                        setRidePopUpPanel = {setRidePopUpPanel}
                        confirmRide={confirmRide}
                        setConfirmRidePopUpPanel = {setConfirmRidePopUpPanel}/>
                   </div>
                    <div ref={confirmRidePopUpPanelRef} className='fixed z-10 translate-y-full h-screen bottom-0 bg-white p-3 w-full'>
                        <ConfirmRidePopUp setConfirmRidePopUpPanel = {setConfirmRidePopUpPanel} setRidePopUpPanel = {setRidePopUpPanel}/>
                   </div>
          </div>  
          
    </div>
  )
}

export default RiderHome




// import React, { useState, useRef, useEffect, useContext } from 'react'
// import { Link } from 'react-router-dom'
// import riderimg from '/src/assets/images/rider.png'
// import RiderDetails from '../components/RiderDetails'
// import RidePopUp from '../components/RidePopUp'
// import { useGSAP } from '@gsap/react'
// import gsap from 'gsap'
// import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
// import { SocketContext } from '../context/SocketContext'
// import { RiderDataContext } from '../context/RiderContext'

// const RiderHome = () => {
//   const ridePopUpPanelRef = useRef(null)
//   const confirmRidePopUpPanelRef = useRef(null)

//   const [ridePopUpPanel, setRidePopUpPanel] = useState(false)  // start false, popup hidden
//   const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
//   const [ride, setRide] = useState(null)

//   const { socket } = useContext(SocketContext)
//   const { rider } = useContext(RiderDataContext)

//   // Join socket room, listen for new rides and update location periodically
//   useEffect(() => {
//     if (!socket || !rider?._id) return

//     // Join rider room
//     socket.emit('join', {
//       userId: rider._id,
//       userType: 'rider',
//     })

//     // Handle incoming new ride events
//     const handleNewRide = (data) => {
//       console.log('New ride received:', data)
//       setRide(data)
//     }
//     socket.on('new-ride', handleNewRide)

//     // Update location function
//     const updateLocation = () => {
//       if (!navigator.geolocation) return
//       navigator.geolocation.getCurrentPosition((position) => {
//         socket.emit('update-location-rider', {
//           userId: rider._id,
//           location: {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           },
//         })
//         console.log('📍 Location sent:', position.coords.latitude, position.coords.longitude)
//       })
//     }

//     // Initial location update
//     updateLocation()
//     // Update location every 5 seconds (5000ms)
//     const locationInterval = setInterval(updateLocation, 5000)

//     // Cleanup on unmount
//     return () => {
//       socket.off('new-ride', handleNewRide)
//       clearInterval(locationInterval)
//     }
//   }, [socket, rider?._id])

//   // When ride changes, show popup
//   useEffect(() => {
//     if (ride) {
//       setRidePopUpPanel(true)
//     } else {
//       setRidePopUpPanel(false)
//     }
//   }, [ride])

//   // GSAP animations for ride popup
//   useGSAP(() => {
//     if (ridePopUpPanel) {
//       gsap.to(ridePopUpPanelRef.current, { transform: 'translateY(0)' })
//     } else {
//       gsap.to(ridePopUpPanelRef.current, { transform: 'translateY(100%)' })
//     }
//   }, [ridePopUpPanel])

//   // GSAP animations for confirm ride popup
//   useGSAP(() => {
//     if (confirmRidePopUpPanel) {
//       gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(0)' })
//     } else {
//       gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(100%)' })
//     }
//   }, [confirmRidePopUpPanel])

//   return (
//     <div>
//       <div className="h-screen">
//         <div className="fixed p-6 top-0 flex items-center justify-between w-full">
//           <img className="w-16" src={riderimg} alt="Rider" />
//           <Link
//             to="/home"
//             className="fixed h-12 w-12 top-7 bg-slate-100 flex right-4 items-center justify-center rounded-full"
//           >
//             <i className="text-2xl ri-logout-box-r-line"></i>
//           </Link>
//         </div>

//         <div className="h-3/5">
//           <img
//             className="h-full w-full object-cover"
//             src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
//             alt="Rider background"
//           />
//         </div>

//         <div className="h-2/5 p-4 mt-6">
//           <RiderDetails />
//         </div>

//         {/* Ride Popup */}
//         <div
//           ref={ridePopUpPanelRef}
//           className="fixed z-10 translate-y-full bottom-0 bg-white p-3 w-full"
//         >
//           <RidePopUp
//             ride={ride}
//             setRidePopUpPanel={setRidePopUpPanel}
//             setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
//           />
//         </div>

//         {/* Confirm Ride Popup */}
//         <div
//           ref={confirmRidePopUpPanelRef}
//           className="fixed z-10 translate-y-full h-screen bottom-0 bg-white p-3 w-full"
//         >
//           <ConfirmRidePopUp
//             setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
//             setRidePopUpPanel={setRidePopUpPanel}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RiderHome

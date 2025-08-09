import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import userimg from '/src/assets/images/user.png'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import 'remixicon/fonts/remixicon.css'
import LocationSearch from '../components/LocationSearch'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmedVehicle from '../components/ConfirmedVehicle'
import LookingForRider from '../components/LookingForRider'
import WaitingForRider from '../components/WaitingForRider'
import {SocketContext} from '../context/SocketContext'
import { useContext } from 'react'
import {UserDataContext} from '../context/UserContext'
import { useEffect } from 'react'



const Home = () => {

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [locationSuggest, setLocationSuggest] = useState(false)
  const panel = useRef(null)
  const downPanel = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmedVehicleRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForRiderRef = useRef(null)

  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmedVehicle, setConfirmedVehicle] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForRider, setWaitingForRider] = useState(false)
  const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)



const {socket} = useContext(SocketContext)
const { user } = useContext(UserDataContext)

useEffect(() => { 
    socket.emit('join', { userId: user._id, userType: 'user' });
    
} ,[user])

socket.on('ride-confirmed', (ride) => {

  setVehicleFound(false)
   setWaitingForRider(true)
   setRide(ride)
});


const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`http://localhost:4000/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(Array.isArray(response.data) ? response.data : [])
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`http://localhost:4000/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(response.data)
            setDestinationSuggestions(Array.isArray(response.data) ? response.data : [])
        } catch {
            // handle error
        }
    }






  const submitHandler = (e) =>{
    e.preventDefault();
  }

  useGSAP(function() {
   if(locationSuggest){
     gsap.to(panel.current,{
      height: '70%' ,
      padding:24,
      
    })
    gsap.to(downPanel.current,{
      opacity:1
    })
   }
   else{
    gsap.to(panel.current,{
      height: '0%' ,
      padding:0,
      
    })
    gsap.to(downPanel.current,{
      opacity:0
    })  
   }
  },[locationSuggest])


  useGSAP(function() {
      if(vehiclePanel){
         gsap.to(vehiclePanelRef.current,{
         transform: 'translateY(0)',
    })
      }else{
        gsap.to(vehiclePanelRef.current,{
         transform: 'translateY(100%)',
        })
      }
   

  }, [vehiclePanel])

   useGSAP(function() {
      if(confirmedVehicle){
         gsap.to(confirmedVehicleRef.current,{
         transform: 'translateY(0)',
    })
      }else{
        gsap.to(confirmedVehicleRef.current,{
         transform: 'translateY(100%)',
        })
      }
   

  }, [confirmedVehicle])

  useGSAP(function() {
      if(vehicleFound){
         gsap.to(vehicleFoundRef.current,{
         transform: 'translateY(0)',
    })
      }else{
        gsap.to(vehicleFoundRef.current,{
         transform: 'translateY(100%)',
        })
      }
   

  }, [vehicleFound])

   useGSAP(function() {
      if(waitingForRider){
         gsap.to(waitingForRiderRef.current,{
         transform: 'translateY(0)',
    })
      }else{
        gsap.to(waitingForRiderRef.current,{
         transform: 'translateY(100%)',
        })
      }
   

  }, [waitingForRider])


async function findTrip(){
  setVehiclePanel(true)
  setLocationSuggest(false)

  const response = await axios.get(`http://localhost:4000/rides/get-fare`, {
    params: { pickup, destination },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  setFare(response.data)

  console.log(response.data)

}



async function createRide(){
  const response = await axios.post(`http://localhost:4000/rides/create`, {
    pickup,
    destination,
    vehicleType
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  console.log(response.data)
}





  return (
    <div className='h-screen relative overflow-hidden'>
      {/* homepage */}
      <img className='w-20 absolute top-5 left-5' src={`${userimg}`} alt="" />

      <div  className='h-screen w-screen'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
      </div>

      <div className=' h-screen absolute top-0 w-full flex flex-col justify-end '>
        <div className='h-[30%] p-8 bg-white relative'>
           <h5 ref={downPanel}
            onClick={()=>{
            setLocationSuggest(false)
           }} className='text-2xl absolute opacity-0 right-10'><i className="ri-arrow-down-wide-fill"></i></h5>
           <h4 className='text-3xl font-medium  '>Find a ride</h4>
           <form onSubmit={ (e)=>{
             submitHandler(e)
           }}>
              {/* <div className="line absolute h-16 w-1 top-0 bg-gray-700 rounded-full"></div> */}
              <input 
              onClick={() => {
                setActiveField('pickup')
                setLocationSuggest(true)}
              }
              value={pickup}
              onChange={handlePickupChange}
              className='bg-[#eee] px-8 py-1 rounded-lg text-lg mt-4 w-full' type="text" placeholder='Your Location' />
             
             
              <input
               onClick={() => {
                setActiveField('destination')
                setLocationSuggest(true)}}
              value={destination}
              onChange={(handleDestinationChange) }
              className='bg-[#eee] px-8 py-1 rounded-lg text-lg w-full mt-3' type="text" placeholder='Your destination' />
           </form>
            <button onClick={findTrip}
                     className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                    Find Trip
               </button>

        </div>

        <div ref={panel} className='bg-white h-0'>
           <LocationSearch 
           suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
           setPickup={setPickup}
           setDestination={setDestination}
           activeField={activeField}
           setLocationSuggest={setLocationSuggest} setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

       <div ref={vehiclePanelRef} className='fixed z-10 translate-y-full  bottom-0 bg-white p-3 w-full'>
          <VehiclePanel
          fare={fare}
           setVehicleType={setVehicleType}
          setConfirmedVehicle={setConfirmedVehicle} setVehiclePanel={setVehiclePanel}/>
       </div>

       <div ref={confirmedVehicleRef} className='fixed z-10 translate-y-full  bottom-0 bg-white p-3 w-full'>
         <ConfirmedVehicle
          createRide={createRide}
          fare={fare}
          vehicleType={vehicleType}
          pickup ={pickup}
        
          destination={destination}
         setConfirmedVehicle={setConfirmedVehicle} setVehicleFound = {setVehicleFound}/>
       </div>

        <div ref={vehicleFoundRef} className='fixed z-10 translate-y-full  bottom-0 bg-white p-3 w-full'>
         <LookingForRider 
          createRide={createRide}
          fare={fare}
          vehicleType={vehicleType}
          pickup ={pickup}
          destination={destination}
         setVehicleFound = {setVehicleFound}/>
       </div>

        <div ref={waitingForRiderRef} className='fixed z-10 translate-y-full  bottom-0 bg-white p-3 w-full'>
         <WaitingForRider  
         ride={ride}
         setVehicleFound={setVehicleFound}
         setWaitingForRider={setWaitingForRider}
         waitingForRider = {waitingForRider} />
       </div>

    
    </div>
  ) 
}

export default Home
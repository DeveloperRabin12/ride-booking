import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import userimg from '/src/assets/images/user.png'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearch from '../components/LocationSearch'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmedVehicle from '../components/ConfirmedVehicle'
import LookingForRider from '../components/LookingForRider'
import WaitingForRider from '../components/WaitingForRider'
import RideInProgress from '../components/RideInProgress'
import { SocketContext } from '../context/SocketContext'
import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [locationSuggest, setLocationSuggest] = useState(false)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmedVehicle, setConfirmedVehicle] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForRider, setWaitingForRider] = useState(false)
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [fare, setFare] = useState({})
  const [vehicleType, setVehicleType] = useState(null)
  const [ride, setRide] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [availableRiders, setAvailableRiders] = useState([])
  const [rideInProgress, setRideInProgress] = useState(false)

  const panel = useRef(null)
  const downPanel = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmedVehicleRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForRiderRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  // Socket connection and event handling
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit('join', { userId: user._id, userType: 'user' });

    // Handle ride confirmation
    const handleRideConfirmed = (confirmedRide) => {
      console.log('Ride confirmed:', confirmedRide);
      setVehicleFound(false);
      setWaitingForRider(true);
      setRide(confirmedRide);
    };

    // Handle ride acceptance
    const handleRideAccepted = (data) => {
      console.log('Ride accepted by rider:', data);
      setVehicleFound(false);
      setWaitingForRider(true);
      setRide(prevRide => ({
        ...prevRide,
        status: 'accepted',
        riderName: data.riderName,
        estimatedTime: data.estimatedTime
      }));
    };

    // Handle ride start
    const handleRideStarted = (data) => {
      console.log('Ride started:', data);
      setWaitingForRider(false);
      setRideInProgress(true);
      setRide(prevRide => ({
        ...prevRide,
        status: 'ongoing',
        riderName: data.riderName,
        estimatedTime: data.estimatedTime
      }));
    };

    // Handle ride finish
    const handleRideFinished = (data) => {
      console.log('Ride finished:', data);
      setWaitingForRider(false);
      setVehicleFound(false);
      setRideInProgress(false);
      setRide(null);
      setPickup('');
      setDestination('');
      setVehicleType(null);
      setFare({});
    };

    socket.on('ride-confirmed', handleRideConfirmed);
    socket.on('ride-accepted', handleRideAccepted);
    socket.on('ride-started', handleRideStarted);
    socket.on('ride-finished', handleRideFinished);

    return () => {
      socket.off('ride-confirmed', handleRideConfirmed);
      socket.off('ride-accepted', handleRideAccepted);
      socket.off('ride-started', handleRideStarted);
      socket.off('ride-finished', handleRideFinished);
    };
  }, [socket, user?._id]);

  // Debounced location search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchTerm, setSuggestions, fieldType) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (searchTerm.length < 2) {
            setSuggestions([]);
            return;
          }

          try {
            const response = await axios.get(`http://localhost:4000/maps/get-suggestions`, {
              params: { input: searchTerm },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });

            const suggestions = Array.isArray(response.data) ? response.data : [];
            console.log(`${fieldType} suggestions:`, suggestions);
            setSuggestions(suggestions);
          } catch (error) {
            console.error(`Error fetching ${fieldType} suggestions:`, error);
            setSuggestions([]);
          }
        }, 300); // 300ms debounce
      };
    })(),
    []
  );

  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
    debouncedSearch(value, setPickupSuggestions, 'pickup');
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    debouncedSearch(value, setDestinationSuggestions, 'destination');
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // GSAP animations
  useGSAP(() => {
    if (locationSuggest) {
      gsap.to(panel.current, {
        height: '70%',
        padding: 24,
      });
      gsap.to(downPanel.current, {
        opacity: 1
      });
    } else {
      gsap.to(panel.current, {
        height: '0%',
        padding: 0,
      });
      gsap.to(downPanel.current, {
        opacity: 0
      });
    }
  }, [locationSuggest]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)',
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)',
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmedVehicle) {
      gsap.to(confirmedVehicleRef.current, {
        transform: 'translateY(0)',
      });
    } else {
      gsap.to(confirmedVehicleRef.current, {
        transform: 'translateY(100%)',
      });
    }
  }, [confirmedVehicle]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)',
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)',
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForRider) {
      gsap.to(waitingForRiderRef.current, {
        transform: 'translateY(0)',
      });
    } else {
      gsap.to(waitingForRiderRef.current, {
        transform: 'translateY(100%)',
      });
    }
  }, [waitingForRider]);

  async function findTrip() {
    if (!pickup || !destination) {
      setSearchError('Please enter both pickup and destination locations');
      return;
    }

    setSearchError('');
    setIsSearching(true);

    try {
      // First get the fare
      const fareResponse = await axios.get(`http://localhost:4000/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setFare(fareResponse.data);
      console.log('Fare calculated:', fareResponse.data);

      // Now search for available riders
      const ridersResponse = await axios.get(`http://localhost:4000/riders/search-nearby`, {
        params: {
          pickup: pickup,
          radius: 5
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setAvailableRiders(ridersResponse.data);
      console.log('Available riders found:', ridersResponse.data);

      setVehiclePanel(true);
      setLocationSuggest(false);
    } catch (error) {
      console.error('Error in findTrip:', error);
      setSearchError('Error finding trip. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  async function createRide() {
    if (!vehicleType) {
      setSearchError('Please select a vehicle type');
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.post(`http://localhost:4000/rides/create`, {
        pickup,
        destination,
        vehicleType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Ride created:', response.data);
      setRide({
        ...response.data,
        pickup,
        destination
      });
      setVehicleFound(true);
      setConfirmedVehicle(false);
      setVehiclePanel(false);
    } catch (error) {
      console.error('Error creating ride:', error);
      setSearchError('Error creating ride. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      {/* homepage */}
      <img className='w-20 absolute top-5 left-5' src={`${userimg}`} alt="" />

      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
      </div>

      <div className='h-screen absolute top-0 w-full flex flex-col justify-end'>
        <div className='h-[30%] p-8 bg-white relative'>
          <h5 ref={downPanel}
            onClick={() => {
              setLocationSuggest(false)
            }} className='text-2xl absolute opacity-0 right-10'><i className="ri-arrow-down-wide-fill"></i></h5>

          <h4 className='text-3xl font-medium'>Find a ride</h4>

          {/* Error message */}
          {searchError && (
            <div className='text-red-500 text-sm mt-2 mb-2'>{searchError}</div>
          )}

          <form onSubmit={submitHandler}>
            <input
              onClick={() => {
                setActiveField('pickup')
                setLocationSuggest(true)
              }}
              value={pickup}
              onChange={handlePickupChange}
              className='bg-[#eee] px-8 py-1 rounded-lg text-lg mt-4 w-full'
              type="text"
              placeholder='Your Location'
            />

            <input
              onClick={() => {
                setActiveField('destination')
                setLocationSuggest(true)
              }}
              value={destination}
              onChange={handleDestinationChange}
              className='bg-[#eee] px-8 py-1 rounded-lg text-lg w-full mt-3'
              type="text"
              placeholder='Your destination'
            />
          </form>

          <button
            onClick={findTrip}
            disabled={isSearching || !pickup || !destination}
            className={`px-4 py-2 rounded-lg mt-3 w-full ${isSearching || !pickup || !destination
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
              } text-white`}
          >
            {isSearching ? 'Calculating...' : 'Find Trip'}
          </button>
        </div>

        <div ref={panel} className='bg-white h-0'>
          <LocationSearch
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
            setLocationSuggest={setLocationSuggest}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className='fixed z-10 translate-y-full bottom-0 bg-white p-3 w-full'>
        <VehiclePanel
          fare={fare}
          setVehicleType={setVehicleType}
          setConfirmedVehicle={setConfirmedVehicle}
          setVehiclePanel={setVehiclePanel}
          availableRiders={availableRiders}
        />
      </div>

      <div ref={confirmedVehicleRef} className='fixed z-10 translate-y-full bottom-0 bg-white p-3 w-full'>
        <ConfirmedVehicle
          createRide={createRide}
          fare={fare}
          vehicleType={vehicleType}
          pickup={pickup}
          destination={destination}
          setConfirmedVehicle={setConfirmedVehicle}
          setVehicleFound={setVehicleFound}
          isSearching={isSearching}
        />
      </div>

      <div ref={vehicleFoundRef} className='fixed z-10 translate-y-full bottom-0 bg-white p-3 w-full'>
        <LookingForRider
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
        />
      </div>

      <div ref={waitingForRiderRef} className='fixed z-10 translate-y-full bottom-0 bg-white p-3 w-full'>
        <WaitingForRider
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForRider={setWaitingForRider}
          waitingForRider={waitingForRider}
        />
      </div>

      {/* Ride in Progress */}
      {rideInProgress && (
        <RideInProgress rideData={ride} />
      )}
    </div>
  )
}

export default Home
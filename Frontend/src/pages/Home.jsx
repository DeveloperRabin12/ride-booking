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

  const pickupInputRef = useRef(null)
  const destinationInputRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmedVehicleRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForRiderRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  // Initialize suggestions
  useEffect(() => {
    setPickupSuggestions([]);
    setDestinationSuggestions([]);
  }, []);

  // Socket connection and event handling
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit('join', { userId: user._id, userType: 'user' });

    // Handle ride confirmation
    const handleRideConfirmed = (confirmedRide) => {
      setVehicleFound(false);
      setWaitingForRider(true);
      setRide(confirmedRide);
    };

    // Handle ride acceptance
    const handleRideAccepted = (data) => {
      setVehicleFound(false);
      setWaitingForRider(true);
      setRide(prevRide => {
        const updatedRide = {
          ...prevRide,
          status: 'accepted',
          riderName: data.riderName,
          estimatedTime: data.estimatedTime
        };
        return updatedRide;
      });
    };

    // Handle ride start
    const handleRideStarted = (data) => {
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

  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // GSAP animations for other panels
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

      // Now search for available riders
      const ridersResponse = await axios.get(`http://localhost:4000/riders/search-nearby`, {
        params: {
          pickup: pickup,
          radius: 15
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setAvailableRiders(ridersResponse.data);

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
      <img className='w-20 absolute top-5 left-5 z-20' src={`${userimg}`} alt="" />

      {/* Background with overlay */}
      <div className='h-screen w-screen relative'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
        <div className='absolute inset-0 bg-black bg-opacity-40'></div>
      </div>

      {/* Main Content */}
      <div className='h-screen absolute top-0 w-full flex flex-col justify-end z-10'>
        {/* Enhanced Header */}
        <div className='px-8 pt-20 pb-4'>
          <div className='text-center text-white mb-6'>
            <h1 className='text-4xl font-bold mb-2'>🚗 Find Your Ride</h1>
            <p className='text-lg opacity-90'>Quick, safe, and reliable transportation</p>
          </div>
        </div>

        {/* Enhanced Form Card */}
        <div className='bg-white rounded-t-3xl p-8 shadow-2xl relative'>
          {/* Decorative elements */}
          <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>

          {/* Error message */}
          {searchError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2'>
              <i className="ri-error-warning-line text-red-500"></i>
              <span className='text-red-700 text-sm'>{searchError}</span>
            </div>
          )}

          {/* Enhanced Form */}
          <form onSubmit={submitHandler} className='space-y-4'>
            {/* Pickup Location */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Pickup Location</label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500'>
                  <i className="ri-map-pin-2-fill text-xl"></i>
                </div>
                <input
                  ref={pickupInputRef}
                  onClick={() => {
                    setActiveField('pickup')
                    setLocationSuggest(true)
                  }}
                  value={pickup}
                  onChange={handlePickupChange}
                  className='w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
                  type="text"
                  placeholder='Where are you now?'
                />
                {pickup && (
                  <button
                    type="button"
                    onClick={() => setPickup('')}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    <i className="ri-close-circle-fill text-xl"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Destination Location */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Destination</label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500'>
                  <i className="ri-map-pin-2-fill text-xl"></i>
                </div>
                <input
                  ref={destinationInputRef}
                  onClick={() => {
                    setActiveField('destination')
                    setLocationSuggest(true)
                  }}
                  value={destination}
                  onChange={handleDestinationChange}
                  className='w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
                  type="text"
                  placeholder='Where do you want to go?'
                />
                {destination && (
                  <button
                    type="button"
                    onClick={() => setDestination('')}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    <i className="ri-close-circle-fill text-xl"></i>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Enhanced Find Trip Button */}
          <button
            onClick={findTrip}
            disabled={isSearching || !pickup || !destination}
            className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${isSearching || !pickup || !destination
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg'
              }`}
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Finding your ride...</span>
              </>
            ) : (
              <>
                <i className="ri-search-line text-xl"></i>
                <span>Find Trip</span>
              </>
            )}
          </button>
        </div>

        {/* Location Search Popover */}
        {locationSuggest && (
          <LocationSearch
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
            setLocationSuggest={setLocationSuggest}
            triggerRef={activeField === 'pickup' ? pickupInputRef : destinationInputRef}
            onSearch={async (searchTerm, fieldType) => {
              try {
                const response = await axios.get(`http://localhost:4000/maps/get-suggestions`, {
                  params: { input: searchTerm },
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                });

                const newSuggestions = Array.isArray(response.data) ? response.data : [];

                // Update the appropriate suggestions state
                if (fieldType === 'pickup') {
                  setPickupSuggestions(newSuggestions);
                } else {
                  setDestinationSuggestions(newSuggestions);
                }

                // Signal search completion to LocationSearch component
                return { success: true, suggestions: newSuggestions };
              } catch (error) {
                console.error(`Error fetching ${fieldType} suggestions:`, error);
                // Keep existing suggestions on error
                return { success: false, error: error.message };
              }
            }}
          />
        )}
      </div>

      {/* Vehicle Panel */}
      <div ref={vehiclePanelRef} className='fixed z-10 translate-y-full bottom-0 bg-white p-3 w-full'>
        <VehiclePanel
          fare={fare}
          setVehicleType={setVehicleType}
          setConfirmedVehicle={setConfirmedVehicle}
          setVehiclePanel={setVehiclePanel}
          availableRiders={availableRiders}
        />
      </div>

      {/* Confirmed Vehicle */}
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

      {/* Looking for Rider */}
      <div ref={vehicleFoundRef} className='fixed z-10 translate-y-full bottom-0 bg-white p-3 w-full'>
        <LookingForRider
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
        />
      </div>

      {/* Waiting for Rider */}
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
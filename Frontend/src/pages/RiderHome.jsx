import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '../context/SocketContext'
import { useRider } from '../context/RiderContext'
import { gsap } from 'gsap'
import RiderDetails from '../components/RiderDetails'
import RiderRideRequest from '../components/RiderRideRequest'
import WaitingForRider from '../components/WaitingForRider'
import FinishRide from '../components/FinishRide'
import ConfirmedVehicle from '../components/ConfirmedVehicle'
import Riding from '../components/Riding'

const RiderHome = () => {
  const { socket, isConnected } = useSocket();
  const { rider } = useRider();
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [rideData, setRideData] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle'); // idle, looking, waiting, riding, finished
  const [currentLocation, setCurrentLocation] = useState(null);
  const [onlineTime, setOnlineTime] = useState(0);
  const locationIntervalRef = useRef(null);
  const timeIntervalRef = useRef(null);

  // Debug: Log rider data to see what's available
  useEffect(() => {
    console.log('RiderHome - Current rider data:', rider);
    console.log('RiderHome - Rider fullname:', rider?.fullname);
    console.log('RiderHome - Rider name:', rider?.name);
    console.log('RiderHome - Rider email:', rider?.email);
  }, [rider]);

  // Debug: Log when dependencies change
  useEffect(() => {
    console.log('🔄 Dependencies changed:', {
      socket: !!socket,
      riderId: rider?._id,
      isConnected: isConnected
    });
  }, [socket, rider?._id, isConnected]);

  // Get current location and send to backend
  const updateLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            setCurrentLocation(location);

            // Send location update to backend via socket
            if (socket && rider?._id) {
              socket.emit('rider-location-update', {
                riderId: rider._id,
                location: location
              });
              console.log('📍 Location sent to backend:', location);
            }
          },
          (error) => {
            console.error('❌ Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        );
      }
    } catch (error) {
      console.error('❌ Error in updateLocation:', error);
    }
  };

  // Update online time
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => {
      setOnlineTime(prev => prev + 1);
    }, 60000); // Update every minute

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Format online time
  const formatOnlineTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Handle new ride request
  const handleNewRide = (data) => {
    console.log('🚗 New ride request received:', data);
    setRideData(data);
    setRidePopUpPanel(true);
    setRideStatus('looking');
  };

  // Handle ride acceptance
  const handleAcceptRide = () => {
    if (rideData && rider) {
      console.log('✅ Ride accepted by rider:', rider.fullname.firstname);
      setRideStatus('waiting');
      setRidePopUpPanel(false);

      // Notify user that ride is accepted
      if (socket) {
        socket.emit('ride-accepted', {
          rideId: rideData._id,
          riderId: rider._id,
          riderName: `${rider.fullname.firstname} ${rider.fullname.lastname}`,
          estimatedTime: '5-10 minutes'
        });
      }
    }
  };

  // Handle ride rejection
  const handleRejectRide = () => {
    console.log('❌ Ride rejected');
    setRidePopUpPanel(false);
    setRideStatus('idle');
    setRideData(null);
  };

  // Handle ride start
  const handleStartRide = () => {
    setRideStatus('riding');
    console.log('🚀 Ride started');

    // Notify user that ride has started
    if (socket && rideData) {
      socket.emit('ride-started', {
        rideId: rideData._id,
        riderId: rider._id,
        riderName: `${rider.fullname.firstname} ${rider.fullname.lastname}`,
        estimatedTime: '5-10 minutes'
      });
    }
  };

  // Handle ride finish
  const handleFinishRide = () => {
    setRideStatus('finished');
    console.log('🏁 Ride finished');

    // Notify user that ride has finished
    if (socket && rideData) {
      socket.emit('ride-finished', {
        rideId: rideData._id,
        riderId: rider._id,
        riderName: `${rider.fullname.firstname} ${rider.fullname.lastname}`
      });
    }
  };

  // Handle ride reset
  const handleResetRide = () => {
    setRideStatus('idle');
    setRideData(null);
    setRidePopUpPanel(false);
    console.log('🔄 Ride reset to idle');
  };

  useEffect(() => {
    if (socket && rider?._id && isConnected) {
      console.log('🔌 Rider connecting to socket...');
      console.log('📊 Rider data available:', rider);
      console.log('🔑 Rider ID being sent:', rider._id);
      console.log('🔌 Socket connected:', socket.connected);

      // Join as rider
      socket.emit('join', {
        userId: rider._id,
        userType: 'rider'
      });

      // Listen for new ride requests
      socket.on('new-ride', handleNewRide);

      // Listen for connection confirmations
      socket.on('rider-connected', (data) => {
        console.log('✅ Rider connected confirmation:', data);
      });

      socket.on('rider-reconnected', (data) => {
        console.log('🔄 Rider reconnected confirmation:', data);
      });

      socket.on('location-updated', (data) => {
        console.log('📍 Location update confirmation:', data);
      });

      socket.on('status-updated', (data) => {
        console.log('🔄 Status update confirmation:', data);
      });

      socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });

      // Start location updates
      updateLocation(); // Initial location
      locationIntervalRef.current = setInterval(updateLocation, 15000); // Every 15 seconds

      // Send initial status update
      socket.emit('rider-status-update', {
        riderId: rider._id,
        status: 'active'
      });

      return () => {
        console.log('🧹 Cleaning up rider socket listeners...');
        socket.off('new-ride');
        socket.off('rider-connected');
        socket.off('rider-reconnected');
        socket.off('location-updated');
        socket.off('status-updated');
        socket.off('error');

        if (locationIntervalRef.current) {
          clearInterval(locationIntervalRef.current);
        }
      };
    } else {
      console.log('❌ Cannot connect rider to socket:', {
        socket: !!socket,
        riderId: rider?._id,
        rider: rider,
        isConnected: isConnected
      });
    }
  }, [socket, rider?._id, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Render different components based on ride status
  const renderRideComponent = () => {
    switch (rideStatus) {
      case 'looking':
        return (
          <RiderRideRequest
            rideData={rideData}
            onAccept={handleAcceptRide}
            onReject={handleRejectRide}
          />
        );
      case 'waiting':
        return (
          <WaitingForRider
            rideData={rideData}
            onStart={handleStartRide}
          />
        );
      case 'riding':
        return (
          <Riding
            rideData={rideData}
            onFinish={handleFinishRide}
          />
        );
      case 'finished':
        return (
          <FinishRide
            rideData={rideData}
            onReset={handleResetRide}
          />
        );
      default:
        return <RiderDetails onlineTime={onlineTime} />;
    }
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Status Indicators - Positioned to avoid overlap */}
      {/* Connection Status Badges */}
      <div className="absolute top-20 right-4 flex gap-2">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {formatOnlineTime(onlineTime)}
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full">
        {renderRideComponent()}
      </div>
    </div>
  );
};

export default RiderHome;

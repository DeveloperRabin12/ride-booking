const rideService = require('../services/ride.service');
const { sendMessageToSocketId, sendMessageToRoom } = require('../socket');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res, next) => {
    try {
        const { pickup, destination, vehicleType } = req.body;

        if (!pickup || !destination || !vehicleType) {
            return res.status(400).json({ message: 'Pickup, destination, and vehicle type are required' });
        }

        // Create the ride first
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        console.log(`🚗 Ride created successfully:`, {
            rideId: ride._id,
            userId: req.user._id,
            userSocketId: req.user.socketId,
            status: ride.status
        });

        // Send response immediately
        res.status(201).json(ride);

        // Now asynchronously search for riders and send notifications
        try {
            console.log(`\n🚗 New ride created: ${ride._id}`);
            console.log(`   User: ${req.user.fullname.firstname} ${req.user.fullname.lastname}`);
            console.log(`   Pickup: ${pickup}`);
            console.log(`   Destination: ${destination}`);
            console.log(`   Vehicle: ${vehicleType}`);

            // Get ride with user details for notification
            const rideWithUser = await rideService.getRideById(ride._id);

            // Search for nearby riders
            const mapService = require('../services/maps.service');
            const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

            if (!pickupCoordinates || !pickupCoordinates.lat || !pickupCoordinates.lng) {
                console.log('❌ Could not get pickup coordinates');
                return;
            }

            console.log(`📍 Pickup coordinates: (${pickupCoordinates.lat}, ${pickupCoordinates.lng})`);

            // Find riders within 15km radius
            const ridersInRadius = await mapService.getRiderInRadius(
                pickupCoordinates.lat,
                pickupCoordinates.lng,
                15
            );

            console.log(`🎯 Found ${ridersInRadius.length} riders in radius`);

            if (ridersInRadius.length === 0) {
                console.log('❌ No riders available in the area');
                return;
            }

            // Send notifications to all riders in radius
            let notificationsSent = 0;
            for (const rider of ridersInRadius) {
                try {
                    if (rider.socketId) {
                        const notificationData = {
                            rideId: ride._id,
                            user: {
                                id: req.user._id,
                                name: `${req.user.fullname.firstname} ${req.user.fullname.lastname}`,
                                phone: req.user.phone
                            },
                            pickup: {
                                address: pickup,
                                coordinates: pickupCoordinates
                            },
                            destination: {
                                address: destination
                            },
                            vehicleType: vehicleType,
                            distance: rider.distance,
                            estimatedFare: ride.fare,
                            timestamp: new Date()
                        };

                        const success = await sendMessageToSocketId(rider.socketId, 'new-ride', notificationData);

                        if (success) {
                            notificationsSent++;
                            console.log(`✅ Notification sent to rider ${rider.fullname.firstname} ${rider.fullname.lastname}`);
                            console.log(`   Socket ID: ${rider.socketId}`);
                            console.log(`   Distance: ${rider.distance.toFixed(2)}km`);
                        } else {
                            console.log(`⚠️ Failed to send notification to rider ${rider.fullname.firstname} (socket may be disconnected)`);
                        }
                    } else {
                        console.log(`⚠️ Rider ${rider.fullname.firstname} has no socket ID (not connected)`);
                    }
                } catch (error) {
                    console.error(`❌ Error sending notification to rider ${rider._id}:`, error);
                }
            }

            console.log(`📨 Total notifications sent: ${notificationsSent}/${ridersInRadius.length}`);

            if (notificationsSent === 0) {
                console.log('❌ No riders received notifications - they may be offline');
            }

        } catch (error) {
            console.error('❌ Error in ride notification process:', error);
        }

    } catch (error) {
        console.error('❌ Error creating ride:', error);
        next(error);
    }
};



module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    if (!pickup || !destination) {
        return res.status(400).json({ message: 'Pickup and destination are required' });
    }

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        console.error('❌ Error getting fare:', err);
        return res.status(500).json({ message: err.message });
    }
}


module.exports.confirmRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        // Use req.rider._id since this route is protected by authRider middleware
        const ride = await rideService.confirmRide({ rideId, rider: req.rider });

        // Send confirmation to the user
        if (ride && ride.user && ride.user.socketId) {
            await sendMessageToSocketId(ride.user.socketId, 'ride-confirmed', ride);
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('❌ Error confirming ride:', err);
        return res.status(500).json({ message: err.message });
    }
}

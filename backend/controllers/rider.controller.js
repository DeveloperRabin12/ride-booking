const riderModel = require('../models/riderModels'); //importing riderModel from riderModels.js
const { validationResult } = require('express-validator'); //importing validationResult from express-validator
const riderService = require('../services/riderService'); //importing riderService from riderService.js
const BlackListToken = require('../models/blackListTokens.model'); //importing blackListToken model
const StatsService = require('../services/stats.service');

module.exports.registerRider = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation failed:", errors.array());
        return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body); //logging the request body
    const { fullname, email, password, vehicle } = req.body;
    const isriderExist = await riderModel.findOne({ email });
    if (isriderExist) {
        return res.status(422).json({ message: 'Rider already exists' });
    }

    const hashPassword = await riderModel.hashPassword(password); //hashing the password using riderModel
    const rider = await riderService.createRider({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword,
        vehicleType: vehicle.vehicleType,
        color: vehicle.color,
        numberPlate: vehicle.numberPlate,
    });

    const token = rider.generateAuthToken();
    res.status(201).json({ token, rider });
}

module.exports.loginRider = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const rider = await riderModel.findOne({ email }).select('+password'); //selecting the password field from the database

    if (!rider) {
        return res.status(422).json({ message: 'Invalid email or password' });
    }
    const isMatch = await rider.comparePassword(password);
    if (!isMatch) {
        return res.status(422).json({ message: 'Invalid email or password' });
    }
    const token = rider.generateAuthToken();

    res.cookie('token', token)
    res.status(200).json({ token, rider });
}

module.exports.getRiderProfile = async (req, res, next) => {
    res.status(200).json({ rider: req.rider }) //returning the rider object
}

module.exports.logoutRider = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]; //getting the token from cookies
    await BlackListToken.create({ token }); //creating the blackListToken object
    res.clearCookie('token'); //clearing the cookie

    res.status(200).json({ message: 'Logout successful' }); //returning the success message
}

module.exports.getAllRiders = async (req, res, next) => {
    try {
        const allRiders = await riderModel.find({}).select('-password');
        console.log('All riders in database:', allRiders.length);

        const formattedRiders = allRiders.map(rider => ({
            id: rider._id,
            name: `${rider.fullname.firstname} ${rider.fullname.lastname}`,
            email: rider.email,
            status: rider.status,
            socketId: rider.socketId,
            location: rider.location,
            vehicle: rider.vehicle
        }));

        res.status(200).json({
            total: allRiders.length,
            riders: formattedRiders
        });
    } catch (error) {
        console.error('Error getting all riders:', error);
        res.status(500).json({ message: 'Error getting riders' });
    }
};

module.exports.searchNearbyRiders = async (req, res, next) => {
    try {
        const { pickup, radius = 15 } = req.query;

        if (!pickup) {
            return res.status(400).json({ message: 'Pickup location is required' });
        }

        console.log(`\n=== SEARCHING FOR RIDERS ===`);
        console.log(`Pickup location: ${pickup}`);
        console.log(`Search radius: ${radius}km`);

        // First, let's see what riders exist in the database
        const allRiders = await riderModel.find({}).select('-password');
        console.log(`Total riders in database: ${allRiders.length}`);

        allRiders.forEach(rider => {
            console.log(`Rider ${rider._id}: ${rider.fullname.firstname} ${rider.fullname.lastname}`);
            console.log(`  - Status: ${rider.status}`);
            console.log(`  - Socket ID: ${rider.socketId || 'None'}`);
            console.log(`  - Location: ${JSON.stringify(rider.location)}`);
            console.log(`  - Vehicle: ${rider.vehicle.vehicleType} (${rider.vehicle.color})`);
        });

        // Get coordinates for the pickup location
        const mapService = require('../services/maps.service');
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        console.log(`\nPickup coordinates:`, pickupCoordinates);

        // Find riders in radius using the existing service
        const ridersInRadius = await mapService.getRiderInRadius(pickupCoordinates.lat, pickupCoordinates.lng, radius);

        console.log(`\nRiders found in radius: ${ridersInRadius.length}`);

        // Format the response for the frontend
        const formattedRiders = ridersInRadius.map(rider => ({
            id: rider._id,
            name: `${rider.fullname.firstname} ${rider.fullname.lastname}`,
            vehicleType: rider.vehicle.vehicleType,
            vehicleColor: rider.vehicle.color,
            vehiclePlate: rider.vehicle.numberPlate,
            distance: rider.distance ? `${rider.distance.toFixed(1)} km` : 'Unknown',
            estimatedTime: rider.distance ? `${Math.ceil(rider.distance * 2)} mins` : 'Unknown', // Rough estimate: 2 mins per km
            rating: 4.5, // Default rating for now
            isAvailable: true
        }));

        console.log(`\nFormatted riders for frontend:`, formattedRiders);
        console.log(`=== END SEARCH ===\n`);

        res.status(200).json(formattedRiders);
    } catch (error) {
        console.error('Error searching for nearby riders:', error);
        res.status(500).json({ message: 'Error searching for riders' });
    }
};

module.exports.getRiderStats = async (req, res, next) => {
    try {
        const riderId = req.rider._id;

        // Get today's stats
        const todayStats = await StatsService.getRiderTodayStats(riderId);

        // Get all time stats
        const allTimeStats = await StatsService.getRiderAllTimeStats(riderId);

        // Get trends for last 7 days
        const trends = await StatsService.getRiderTrends(riderId);

        const stats = {
            today: todayStats,
            allTime: allTimeStats,
            trends: trends
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting rider stats:', error);
        res.status(500).json({ message: 'Error getting rider statistics' });
    }
};

module.exports.updateRiderProfile = async (req, res, next) => {
    try {
        const riderId = req.rider._id;
        const { fullname, email, phone, vehicle } = req.body;

        // Validate required fields
        if (!fullname || !email || !phone || !vehicle) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email is already taken by another rider
        const existingRider = await riderModel.findOne({ email, _id: { $ne: riderId } });
        if (existingRider) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        // Update rider profile
        const updatedRider = await riderModel.findByIdAndUpdate(riderId, {
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            phone,
            vehicle: {
                vehicleType: vehicle.vehicleType,
                color: vehicle.color,
                numberPlate: vehicle.numberPlate
            }
        }, { new: true }).select('-password');

        if (!updatedRider) {
            return res.status(404).json({ message: 'Rider not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            rider: updatedRider
        });
    } catch (error) {
        console.error('Error updating rider profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports.getRiderRides = async (req, res, next) => {
    try {
        const riderId = req.rider._id;
        const rideModel = require('../models/ride.model');

        // Get all rides for this rider, ordered by most recent first
        const rides = await rideModel.find({ rider: riderId })
            .sort({ createdAt: -1 })
            .populate('user', 'fullname phone')
            .select('+otp');

        res.status(200).json({
            success: true,
            rides: rides
        });
    } catch (error) {
        console.error('Error getting rider rides:', error);
        res.status(500).json({ message: 'Error getting ride history' });
    }
};
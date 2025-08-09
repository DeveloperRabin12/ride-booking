const rideService = require ('../services/ride.service');
const {validationResult} = require('express-validator');
const mapService = require('../services/maps.service');
const {sendMessageToSocketId} = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({user:req.user._id, pickup, destination,vehicleType});
       res.status(201).json(ride);

       const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

       console.log('Pickup coordinates:', pickupCoordinates);
        const riderInRadius = await mapService.getRiderInRadius(pickupCoordinates.lat, pickupCoordinates.lng, 5);

        ride.otp= ""

          console.log('Riders in radius:', riderInRadius.length, riderInRadius.map(r => ({ id: r._id, socketId: r.socketId, location: r.location })));

        const rideWithUser = await rideModel.findOne({_id:ride._id}).populate('user');
        
       riderInRadius.map(rider => {
            console.log(`Sending new-ride event to rider ${rider._id} with socketId: ${rider.socketId}`);
            sendMessageToSocketId(rider.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })

      


    } catch (err) {
        return res.status(500);
        
    }
}



module.exports.getFare = async(req, res) => { 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, rider: req.rider._id });
        
        
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

const rideModel = require('../models/ride.model')
const mapService = require('./maps.service')
const crypto = require('crypto')


async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        
        car: 50,
        bike: 20
    };

    const perKmRate = {
      
        car: 15,
        bike: 8
    };

    const perMinuteRate = {
        
        car: 3,
        bike: 1.5
    };



    const fare = {
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        bike: Math.round(baseFare.bike + ((distanceTime.distance.value / 1000) * perKmRate.bike) + ((distanceTime.duration.value / 60) * perMinuteRate.bike))
    };

    return fare;


}

module.exports.getFare = getFare;

function getOtp(num){
   function generateOtp(num){
    const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
    return otp;
   }
   return generateOtp(num);
}


module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);



    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[ vehicleType ]
    })

    return ride;
}

module.exports.confirmRide = async ({
    rideId,rider
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        rider: rider._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('rider').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

// Add the missing getRideById function
module.exports.getRideById = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride ID is required');
    }

    const ride = await rideModel.findById(rideId).populate('user');
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};
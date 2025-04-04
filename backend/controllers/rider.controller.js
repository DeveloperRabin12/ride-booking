const riderModel = require('../models/riderModels'); //importing riderModel from riderModels.js
const { validationResult } = require('express-validator'); //importing validationResult from express-validator
const riderService = require('../services/riderService'); //importing riderService from riderService.js

module.exports.registerRider = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        email,
        password: hashPassword,
        vehicleType : vehicle.vehicleType,
        color : vehicle.color,
        numberPlate : vehicle.numberPlate,
    });

    const token = rider.generateAuthToken();
     res.status(201).json({token, rider});
}
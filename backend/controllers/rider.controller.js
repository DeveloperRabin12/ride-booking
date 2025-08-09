const riderModel = require('../models/riderModels'); //importing riderModel from riderModels.js
const { validationResult } = require('express-validator'); //importing validationResult from express-validator
const riderService = require('../services/riderService'); //importing riderService from riderService.js
const BlackListToken = require('../models/blackListTokens.model'); //importing blackListToken model

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

module.exports.getRiderProfile = async (req, res, next)=>{
    res.status(200).json({rider: req.rider}) //returning the rider object
}

module.exports.logoutRider = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]; //getting the token from cookies
    await BlackListToken.create({ token }); //creating the blackListToken object
    res.clearCookie('token'); //clearing the cookie
        
        res.status(200).json({ message: 'Logout successful' }); //returning the success message
}
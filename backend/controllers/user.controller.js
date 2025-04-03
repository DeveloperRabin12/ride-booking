const userModel = require('../models/userModels');
const userService = require('../services/userService');
const { validationResult } = require('express-validator'); //importing validationResult from express-validator

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req); //checking for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //returning the validation errors
    }
    console.log("something")
    console.log(req.body); //logging the request body
   
    const { fullname, email, password } = req.body; //destructuring the request body
   
    const hashPassword = await userModel.hashPassword(password); //hashing the password
    const user = await userService.createUser({
        firstname: fullname.firstname, //getting the firstname from fullname object
        lastname : fullname.lastname, //getting the lastname from fullname object
        email,
        password: hashPassword, // Hash the password before saving
    }); //calling createUser function from userService
    const token = user.generateAuthToken(); //generating the token

    res.status(201).json({token, user})
}


module.exports.loginUser = async (req, res, next) => {
   const errors = validationResult(req); //checking for validation errors
    if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() }); //returning the validation errors
    }
    
    console.log(req.body); //logging the request body
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' }); //returning the error message
    }

    const isMatch = await user.comparePassword(password); //comparing the password
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' }); //returning the error message
    }

    const token = user.generateAuthToken(); //generating the token
    res.status(200).json({ token, user }); //returning the token and user object
    res.cookie('token', token )
    // res.send('this is login user route')

}


module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user) 
}
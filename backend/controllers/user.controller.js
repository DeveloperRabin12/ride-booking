const userModel = require('../models/userModels');
const userService = require('../services/userService');
const { validationResult } = require('express-validator'); //importing validationResult from express-validator
const BlackListToken = require('../models/blackListTokens.model'); //importing blackListToken model
module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req); //checking for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //returning the validation errors
    }
    console.log("something")
    console.log(req.body); //logging the request body
   
    const { fullname, email, password } = req.body; //destructuring the request body
   
    const isUserExist = await userModel.findOne({ email }); //checking if the user already exists
    if (isUserExist) {
        return res.status(400).json({ message: 'User already exists' }); //returning the error message
    }

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

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token'); //clearing the cookie
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]; //getting the token from cookies
    await BlackListToken.create({ token }); //creating the blackListToken object
    
    res.status(200).json({ message: 'Logout successful' }); //returning the success message
}

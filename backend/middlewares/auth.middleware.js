const userModel = require('../models/userModels');
const jwt = require('jsonwebtoken'); //importing jsonwebtoken
const bcrypt = require('bcrypt'); 


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];//getting the token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' }); //returning the error message
    }

    const isBlacklist = await userModel.findOne({ token }); //checking if the token is blacklisted
    if (isBlacklist) {
        return res.status(401).json({ message: 'Unauthorized' }); //returning the error message
    }
    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY); //verifying the token
        const user = await userModel.findById(decode._id); //finding the user by id
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' }); //returning the error message
        }
        req.user = user; //setting the user in request object
        next(); //calling the next middleware
    }
    catch(err){
        return res.status(401).json({ message: 'Unauthorized' }); //returning the error message
    }
}

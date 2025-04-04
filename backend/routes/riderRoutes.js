const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const riderController = require('../controllers/rider.controller'); //importing riderController from rider.controller.js
const authMiddleware = require('../middlewares/auth.middleware'); //importing authMiddleware from authMiddleware.js

router.get('/', (req, res) => {
    res.send('this is rider route page');    
})

router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('vehicle.color').isLength({min: 3}).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.vehicleType').isIn(['bike', 'car']).withMessage('Vehicle type must be either bike or car'),
    body('vehicle.numberPlate').isLength({min: 1}).withMessage('Vehicle plate must be at least 3 characters long'),
],riderController.registerRider)

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
],
riderController.loginRider);

router.get('/profile', authMiddleware.authRider, riderController.getRiderProfile); 

router.get('/logout', authMiddleware.authRider, riderController.logoutRider); //calling logoutUser function from userController

module.exports = router; 

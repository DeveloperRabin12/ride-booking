const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const riderController = require('../controllers/rider.controller'); //importing riderController from rider.controller.js
const authMiddleware = require('../middlewares/auth.middleware'); //importing authMiddleware from authMiddleware.js
const riderModel = require('../models/riderModels'); //importing riderModel from riderModels.js

router.get('/', (req, res) => {
    res.send('this is rider route page');
})


router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.vehicleType').isIn(['bike', 'car']).withMessage('Vehicle type must be either bike or car'),
    body('vehicle.numberPlate').isLength({ min: 1 }).withMessage('Vehicle plate must be at least 3 characters long'),
], riderController.registerRider)

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

],
    riderController.loginRider);

router.get('/profile', authMiddleware.authRider, riderController.getRiderProfile);

router.get('/debug/all', riderController.getAllRiders); // Debug endpoint - remove in production

router.get('/check', (req, res) => {
    res.json({ message: 'Rider routes are working' });
});

router.get('/debug/set-location/:riderId', async (req, res) => {
    try {
        const { riderId } = req.params;
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'lat and lng query parameters are required' });
        }

        const rider = await riderModel.findByIdAndUpdate(riderId, {
            location: { lat: parseFloat(lat), lng: parseFloat(lng) }
        }, { new: true });

        if (!rider) {
            return res.status(404).json({ message: 'Rider not found' });
        }

        res.json({
            message: 'Location updated successfully',
            rider: {
                id: rider._id,
                name: `${rider.fullname.firstname} ${rider.fullname.lastname}`,
                location: rider.location
            }
        });
    } catch (error) {
        console.error('Error setting rider location:', error);
        res.status(500).json({ message: 'Error updating location' });
    }
});

router.get('/search-nearby', authMiddleware.authUser, riderController.searchNearbyRiders);

router.get('/logout', authMiddleware.authRider, riderController.logoutRider); //calling logoutUser function from userController

router.get('/stats', authMiddleware.authRider, riderController.getRiderStats);

router.put('/profile', authMiddleware.authRider, riderController.updateRiderProfile);

router.get('/rides', authMiddleware.authRider, riderController.getRiderRides);

module.exports = router; 

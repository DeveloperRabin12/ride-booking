const express = require('express');
const router = express.Router();
const {body} = require('express-validator')  //importing body from express-validator
const userController = require('../controllers/user.controller') //importing userController from user.controller.js
const authMiddleware = require('../middlewares/auth.middleware') //importing authMiddleware from authMiddleware.js

router.get('/', (req, res) => {
    res.send('this is user route page');    
});

router.post('/register' ,[//using express validtor
body('email').isEmail().withMessage('Please enter a valid email address'),
body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
],
userController.registerUser //calling registerUser function from userController

)

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
],
userController.loginUser);

router.get('/profile',authMiddleware.authUser ,userController.getUserProfile); //calling getUserProfile function from userController

module.exports = router;
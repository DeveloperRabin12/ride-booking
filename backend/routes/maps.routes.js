const express = require ('express');
const router = express.Router();
const authmiddleware = require('../middlewares/auth.middleware')
const mapController = require('../controllers/map.controller.js')
const {query} = require('express-validator')

router.get('/get-coordinates',
      query('address').isString().isLength({min:3}),
    authmiddleware.authUser,mapController.getCoordinates)


    router.get('/distancetime',
      query('origin').isString().isLength({min:3}),
      query('destination').isString().isLength({min:3}),
    authmiddleware.authUser,mapController.getDistanceTime)

    router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authmiddleware.authUser,
    mapController.getAutoCompleteSuggestions
)

    module.exports = router;
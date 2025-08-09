const mapService = require('../services/maps.service');
const {validationResult} = require('express-validator');

module.exports.getCoordinates = async(req, res, next)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).josn({errors:errors.array()});
    }

    const {address}=req.query;

    try{
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    }
    catch(error){
        res.status(500).json({message:'internal server error'});
    }
}

module.exports.getDistanceTime =async(req, res, next)=>{
    // try {
    //     const errors= validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).josn({errors:errors.array()});
    // }

    // const {origin, destination} =req.query;
    // const distanceTime = await mapService.getDistanceTime(origin, destination);
    // res.status(200).json(distanceTime);

    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({message:'internal server err'});
    // }

     try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get origin & destination from query (for GET) or body (for POST)
        const { origin, destination } = req.query; // Change to req.body if using POST

        // Ensure parameters are present
        if (!origin || !destination) {
            return res.status(400).json({ message: 'origin and destination are required' });
        }

        // Call service to calculate distance
        const distanceTime = await mapService.getDistanceTime(origin, destination);

        // Send result
        res.status(200).json(distanceTime);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'internal server error' });
    }
}


module.exports.getAutoCompleteSuggestions = async (req, res, next) => {


        try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;
        if (!input) {
            return res.status(400).json({ message: 'input is required' });
        }

        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }


    //  try {

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array() });
    //     }

    //     const { input } = req.query;

    //     const suggestions = await mapService.getAutoCompleteSuggestions(input);

    //     res.status(200).json(suggestions);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Internal server error' });
    // }
}



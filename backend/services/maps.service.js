const axios = require('axios')
const riderModel = require('../models/riderModels');



module.exports.getAddressCoordinate = async(address)=>{

    const apiKey ='ge-d4c7d159e010de98';
    const url = `https://api.geocode.earth/v1/search?api_key=${apiKey}&text=${address}&size=1`;

    try {
        const response = await axios.get(url);


        if (response.data.features && response.data.features.length > 0) {
      const location = response.data.features[0]
      return {
        lat: location.geometry.coordinates[1], // Geocode Earth uses [lng, lat] format
        lng: location.geometry.coordinates[0],
        formatted_address: location.properties.label, // Additional info
        name: location.properties.name,
        confidence: location.properties.confidence,
      }
    } else {
      throw new Error(`Unable to fetch coordinates: No results found`)
    }
 


        // if (response.data.status === 'OK') {
        //     const location = response.data.results[ 0 ].geometry.location;
        //     return {
        //         ltd: location.lat,
        //         lng: location.lng
        //     };
        // } else {
        //     throw new Error(`Unable to fetch coordinates:${response.data.status}`);
        // }
    } catch (error) {
        console.error(error);
        throw error;
    }
}



// module.exports.getDistanceTime = async (origin, destination)=> {
//     if (!origin || !destination) {
//         throw new Error('origin and destination required');
//     }

//     const apiKey = 'ge-d4c7d159e010de98';

//     // Helper to get coordinates from Geocode Earth
//     async function getCoordinates(address) {
//         const url = `https://api.geocode.earth/v1/search?api_key=${apiKey}&text=${encodeURIComponent(address)}&size=1`;
//         const response = await axios.get(url);
//         if (!response.data.features || response.data.features.length === 0) {
//             throw new Error(`No results for: ${address}`);
//         }
//         return response.data.features[0].geometry.coordinates; // [lon, lat]
//     }

//     // Get coordinates for origin and destination
//     const [lon1, lat1] = await getCoordinates(origin);
//     const [lon2, lat2] = await getCoordinates(destination);

//     // Calculate distance using Haversine formula
//     const R = 6371; // Earth radius in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;

//     const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(lat1 * Math.PI / 180) *
//         Math.cos(lat2 * Math.PI / 180) *
//         Math.sin(dLon / 2) ** 2;

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//      return {
//         distance: {
//             text: `${distanceKm.toFixed(2)} km`,
//             value: distanceMeters
//         },
//         duration: {
//             text: `${Math.ceil(durationSeconds / 60)} mins`,
//             value: durationSeconds
//         }
//     };
// }

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('origin and destination required');
    }

    const apiKey = 'ge-d4c7d159e010de98';

    async function getCoordinates(address) {
        const url = `https://api.geocode.earth/v1/search?api_key=${apiKey}&text=${encodeURIComponent(address)}&size=1`;
        const response = await axios.get(url);

        if (!response.data.features || response.data.features.length === 0) {
            throw new Error(`No results for: ${address}`);
        }

        return response.data.features[0].geometry.coordinates; // [lon, lat]
    }

    const [lon1, lat1] = await getCoordinates(origin);
    const [lon2, lat2] = await getCoordinates(destination);

    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    const distanceMeters = Math.round(distanceKm * 1000);

    // Estimate duration (assuming 40 km/h)
    const avgSpeedKmh = 40;
    const durationHours = distanceKm / avgSpeedKmh;
    const durationSeconds = Math.round(durationHours * 3600);

    return {
        distance: {
            text: `${distanceKm.toFixed(2)} km`,
            value: distanceMeters
        },
        duration: {
            text: `${Math.ceil(durationSeconds / 60)} mins`,
            value: durationSeconds
        }
    };
};




module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = 'ge-d4c7d159e010de98';
    const url = `https://api.geocode.earth/v1/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(input)}&size=5`;



        try {
        const response = await axios.get(url);

        if (!response.data.features || response.data.features.length === 0) {
            return [];
        }

        // Extract place labels from features
        return response.data.features
            .map(feature => feature.properties.label)
            .filter(Boolean)
            .slice(0,5);
    } catch (err) {
        console.error(err.message);
        throw new Error('Unable to fetch suggestions');
    }


    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         return response.data.predictions.map(prediction => prediction.description).filter(value => value);
    //     } else {
    //         throw new Error('Unable to fetch suggestions');
    //     }
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }
}

module.exports.getRiderInRadius = async (lat, lng, radius) => {



    
    const riders = await riderModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6378.1] // radius in radians
            }
        }
    });

    return riders;

}
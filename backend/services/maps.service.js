const axios = require('axios')
const riderModel = require('../models/riderModels');



module.exports.getAddressCoordinate = async (address) => {

    const apiKey = 'ge-d4c7d159e010de98';
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
            .slice(0, 5);
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
    try {
        console.log(`Searching for riders within ${radius}km of (${lat}, ${lng})`);

        // First, let's see ALL riders in the database for debugging
        const allRiders = await riderModel.find({}).lean();
        console.log(`Total riders in database: ${allRiders.length}`);

        allRiders.forEach(rider => {
            console.log(`Rider ${rider._id}: ${rider.fullname.firstname} ${rider.fullname.lastname}`);
            console.log(`  - Status: ${rider.status}`);
            console.log(`  - Socket ID: ${rider.socketId || 'None'}`);
            console.log(`  - Location: ${JSON.stringify(rider.location)}`);
        });

        // For now, let's be VERY lenient and get ALL riders
        // This will help us debug why riders aren't being found
        const riders = await riderModel.find({
            // Remove ALL filters temporarily for debugging
            // We want to see ALL riders regardless of status, socket, or location
        }).lean();

        console.log(`Found ${riders.length} total riders (all filters removed)`);

        // Filter riders within radius (if they have location)
        const ridersInRadius = [];
        for (const rider of riders) {
            // If rider has location, calculate distance
            if (rider.location &&
                typeof rider.location.lat === 'number' &&
                typeof rider.location.lng === 'number' &&
                !isNaN(rider.location.lat) &&
                !isNaN(rider.location.lng)) {

                // Calculate distance using Haversine formula
                const distance = calculateDistance(lat, lng, rider.location.lat, rider.location.lng);
                console.log(`  - Distance calculation: ${distance.toFixed(2)}km (radius: ${radius}km)`);

                if (distance <= radius) {
                    console.log(`  - ✅ Rider ${rider.fullname.firstname} is within radius`);
                    ridersInRadius.push({
                        ...rider,
                        distance: distance
                    });
                } else {
                    console.log(`  - ❌ Rider ${rider.fullname.firstname} is outside radius`);
                }
            } else {
                // If rider has no location, add them anyway for debugging
                console.log(`⚠️ Rider ${rider.fullname.firstname} has no valid location - adding with default distance`);
                ridersInRadius.push({
                    ...rider,
                    distance: 0 // Default distance for riders without location
                });
            }
        }

        // Sort by distance and remove duplicates
        const uniqueRiders = ridersInRadius
            .filter((rider, index, self) =>
                index === self.findIndex(r => r._id.toString() === rider._id.toString())
            )
            .sort((a, b) => a.distance - b.distance);

        console.log(`Found ${uniqueRiders.length} unique riders (including those without location)`);
        uniqueRiders.forEach(rider => {
            if (rider.location && rider.location.lat) {
                console.log(`Rider ${rider._id}: ${rider.fullname.firstname} ${rider.fullname.lastname} at (${rider.location.lat}, ${rider.location.lng}) - ${rider.distance.toFixed(2)}km away`);
            } else {
                console.log(`Rider ${rider._id}: ${rider.fullname.firstname} ${rider.fullname.lastname} - NO LOCATION DATA`);
            }
        });

        console.log(`\nRiders found in radius: ${ridersInRadius.length}`);

        // If no riders found in initial radius, try expanding the search
        if (ridersInRadius.length === 0) {
            console.log(`No riders found in ${radius}km radius. Expanding search to ${radius * 2}km...`);

            const expandedRiders = [];
            for (const rider of riders) {
                if (rider.location &&
                    typeof rider.location.lat === 'number' &&
                    typeof rider.location.lng === 'number' &&
                    !isNaN(rider.location.lat) &&
                    !isNaN(rider.location.lng)) {

                    const distance = calculateDistance(lat, lng, rider.location.lat, rider.location.lng);
                    console.log(`  - Expanded search: ${distance.toFixed(2)}km (expanded radius: ${radius * 2}km)`);

                    if (distance <= radius * 2) {
                        console.log(`  - ✅ Rider ${rider.fullname.firstname} found in expanded radius`);
                        expandedRiders.push({
                            ...rider,
                            distance: distance
                        });
                    }
                }
            }

            if (expandedRiders.length > 0) {
                console.log(`Found ${expandedRiders.length} riders in expanded radius`);
                return expandedRiders.sort((a, b) => a.distance - b.distance);
            }
        }

        return uniqueRiders;
    } catch (error) {
        console.error('Error finding riders in radius:', error);
        throw error;
    }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
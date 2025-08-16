const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testRiderSearch() {
    console.log('🧪 Testing Rider Search with Closer Location...\n');

    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const response = await axios.get(`${BASE_URL}/`);
        console.log('✅ Server is running:', response.data);

        // Test 2: Get all riders
        console.log('\n2. Getting all riders...');
        const ridersResponse = await axios.get(`${BASE_URL}/riders/debug/all`);
        console.log('✅ Found riders:', ridersResponse.data.total);

        if (ridersResponse.data.total === 0) {
            console.log('❌ No riders found!');
            return;
        }

        const firstRider = ridersResponse.data.riders[0];
        console.log(`First rider: ${firstRider.name}`);

        // Test 3: Set rider location closer to pickup location
        console.log('\n3. Setting rider location closer to pickup...');
        console.log('Pickup location: (27.67394, 85.405515)');

        // Set rider location to be within 3km of pickup
        const riderLat = 27.67394 + 0.02; // About 2km north
        const riderLng = 85.405515 + 0.02; // About 2km east

        console.log(`Setting rider location to: (${riderLat.toFixed(6)}, ${riderLng.toFixed(6)})`);

        const locationResponse = await axios.get(`${BASE_URL}/riders/debug/set-location/${firstRider.id}`, {
            params: { lat: riderLat, lng: riderLng }
        });
        console.log('✅ Location updated:', locationResponse.data);

        // Test 4: Calculate distance manually
        console.log('\n4. Calculating distance manually...');
        const R = 6371; // Earth's radius in kilometers
        const dLat = (riderLat - 27.67394) * Math.PI / 180;
        const dLon = (riderLng - 85.405515) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(27.67394 * Math.PI / 180) * Math.cos(riderLat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        console.log(`Distance: ${distance.toFixed(2)} km`);
        console.log(`Is within 15km radius? ${distance <= 15 ? 'YES' : 'NO'}`);

        console.log('\n✅ Test completed! Now try searching for riders in the frontend.');

    } catch (error) {
        console.log('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testRiderSearch();

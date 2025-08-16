const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function debugRiders() {
    console.log('🔍 Debugging Rider Search Issue...\n');

    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const response = await axios.get(`${BASE_URL}/`);
        console.log('✅ Server is running:', response.data);

        // Test 2: Check all riders in database
        console.log('\n2. Checking all riders in database...');
        try {
            const ridersResponse = await axios.get(`${BASE_URL}/riders/debug/all`);
            console.log('✅ Found riders in database:', ridersResponse.data.total);

            if (ridersResponse.data.total === 0) {
                console.log('❌ No riders found! You need to register some riders first.');
                return;
            }

            ridersResponse.data.riders.forEach(rider => {
                console.log(`\nRider: ${rider.name} (${rider.email})`);
                console.log(`  - Status: ${rider.status}`);
                console.log(`  - Socket ID: ${rider.socketId || 'None'}`);
                console.log(`  - Location: ${JSON.stringify(rider.location)}`);
                console.log(`  - Vehicle: ${rider.vehicle.vehicleType} (${rider.vehicle.color})`);
            });
        } catch (error) {
            console.log('❌ Could not fetch riders:', error.response?.data || error.message);
            return;
        }

        // Test 3: Test rider search without authentication (this will fail but show us the error)
        console.log('\n3. Testing rider search (should fail without auth)...');
        try {
            const searchResponse = await axios.get(`${BASE_URL}/riders/search-nearby`, {
                params: { pickup: 'Test Location', radius: 5 }
            });
            console.log('✅ Search response:', searchResponse.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Search endpoint exists but requires authentication (expected)');
            } else {
                console.log('❌ Search error:', error.response?.data || error.message);
            }
        }

        // Test 4: Check if we can manually set a rider location
        console.log('\n4. Testing manual location update...');
        try {
            // Get the first rider ID
            const ridersResponse = await axios.get(`${BASE_URL}/riders/debug/all`);
            if (ridersResponse.data.riders.length > 0) {
                const firstRider = ridersResponse.data.riders[0];
                console.log(`First rider ID: ${firstRider.id}`);

                // Try to set a test location
                const locationResponse = await axios.get(`${BASE_URL}/riders/debug/set-location/${firstRider.id}`, {
                    params: { lat: 26.78058, lng: 88.16741 } // Same coordinates as your test
                });
                console.log('✅ Location updated:', locationResponse.data);
            }
        } catch (error) {
            console.log('❌ Location update failed:', error.response?.data || error.message);
        }

        console.log('\n=== DEBUG SUMMARY ===');
        console.log('1. Server is running ✅');
        console.log('2. Riders in database: Check above');
        console.log('3. Search endpoint: Check above');
        console.log('4. Location update: Check above');

        console.log('\n💡 Next steps:');
        console.log('1. Make sure you have riders in the database');
        console.log('2. Check if riders have location data');
        console.log('3. Test the search with a valid user token');
        console.log('4. Check backend console for detailed logs');

    } catch (error) {
        console.log('❌ Debug failed:', error.message);
    }
}

// Run the debug
debugRiders();

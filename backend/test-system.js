const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testSystem() {
    console.log('🧪 Testing Complete Rider Notification System...\n');

    try {
        // Test 1: Check server connection
        console.log('1. Testing server connection...');
        const response = await axios.get(`${BASE_URL}/`);
        console.log('✅ Server is running:', response.data);

        // Test 2: Check all riders in database
        console.log('\n2. Checking all riders in database...');
        try {
            const ridersResponse = await axios.get(`${BASE_URL}/riders/debug/all`);
            console.log('✅ Found riders in database:', ridersResponse.data.total);
            ridersResponse.data.riders.forEach(rider => {
                console.log(`   - ${rider.name} (${rider.email}): Status=${rider.status}, Socket=${rider.socketId}, Location=${JSON.stringify(rider.location)}`);
            });
        } catch (error) {
            console.log('❌ Could not fetch riders:', error.response?.data || error.message);
        }

        // Test 3: Test rider registration
        console.log('\n3. Testing rider registration...');
        const testRider = {
            email: 'testrider2@example.com',
            password: 'password123',
            fullname: {
                firstname: 'Test',
                lastname: 'Rider2'
            },
            vehicle: {
                color: 'Blue',
                numberPlate: 'TEST456',
                vehicleType: 'car'
            }
        };

        try {
            const registerResponse = await axios.post(`${BASE_URL}/riders/register`, testRider);
            console.log('✅ Rider registration successful:', registerResponse.data.rider.email);
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.message === 'Rider already exists') {
                console.log('ℹ️ Rider already exists, continuing...');
            } else {
                console.log('❌ Rider registration failed:', error.response?.data || error.message);
            }
        }

        // Test 4: Test rider login
        console.log('\n4. Testing rider login...');
        const loginData = {
            email: 'testrider2@example.com',
            password: 'password123'
        };

        try {
            const loginResponse = await axios.post(`${BASE_URL}/riders/login`, loginData);
            console.log('✅ Rider login successful');
            const token = loginResponse.data.token;

            // Test 5: Test rider profile
            console.log('\n5. Testing rider profile...');
            const profileResponse = await axios.get(`${BASE_URL}/riders/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('✅ Rider profile retrieved:', profileResponse.data.rider.email);

        } catch (error) {
            console.log('❌ Rider login failed:', error.response?.data || error.message);
        }

        // Test 6: Test user registration/login
        console.log('\n6. Testing user registration...');
        const testUser = {
            email: 'testuser@example.com',
            password: 'password123',
            fullname: {
                firstname: 'Test',
                lastname: 'User'
            }
        };

        try {
            const userRegisterResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
            console.log('✅ User registration successful');
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.message === 'User already exists') {
                console.log('ℹ️ User already exists, continuing...');
            } else {
                console.log('❌ User registration failed:', error.response?.data || error.message);
            }
        }

        // Test 7: Test user login
        console.log('\n7. Testing user login...');
        try {
            const userLoginResponse = await axios.post(`${BASE_URL}/users/login`, {
                email: 'testuser@example.com',
                password: 'password123'
            });
            console.log('✅ User login successful');
            const userToken = userLoginResponse.data.token;

            // Test 8: Test fare calculation
            console.log('\n8. Testing fare calculation...');
            try {
                const fareResponse = await axios.get(`${BASE_URL}/rides/get-fare`, {
                    params: {
                        pickup: 'New York, NY',
                        destination: 'Brooklyn, NY'
                    },
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                console.log('✅ Fare calculated:', fareResponse.data);
            } catch (error) {
                console.log('❌ Fare calculation failed:', error.response?.data || error.message);
            }

        } catch (error) {
            console.log('❌ User login failed:', error.response?.data || error.message);
        }

    } catch (error) {
        console.log('❌ System test failed:', error.message);
    }
}

// Run the test
testSystem();

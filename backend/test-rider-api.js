const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testRiderAPI() {
    console.log('🧪 Testing Rider API endpoints...\n');

    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const response = await axios.get(`${BASE_URL}/`);
        console.log('✅ Server is running:', response.data);
    } catch (error) {
        console.log('❌ Server connection failed:', error.message);
        return;
    }

    try {
        // Test 2: Test rider registration
        console.log('\n2. Testing rider registration...');
        const testRider = {
            email: 'testrider@example.com',
            password: 'password123',
            fullname: {
                firstname: 'Test',
                lastname: 'Rider'
            },
            vehicle: {
                color: 'Red',
                numberPlate: 'TEST123',
                vehicleType: 'car'
            }
        };

        const registerResponse = await axios.post(`${BASE_URL}/riders/register`, testRider);
        console.log('✅ Rider registration successful:', registerResponse.data);

        // Test 3: Test rider login
        console.log('\n3. Testing rider login...');
        const loginData = {
            email: 'testrider@example.com',
            password: 'password123'
        };

        const loginResponse = await axios.post(`${BASE_URL}/riders/login`, loginData);
        console.log('✅ Rider login successful:', loginResponse.data);

        // Test 4: Test rider profile with token
        console.log('\n4. Testing rider profile...');
        const token = loginResponse.data.token;
        const profileResponse = await axios.get(`${BASE_URL}/riders/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('✅ Rider profile retrieved:', profileResponse.data);

    } catch (error) {
        console.log('❌ API test failed:', error.response?.data || error.message);
    }
}

// Run the test
testRiderAPI();

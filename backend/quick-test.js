const mongoose = require('mongoose');
const riderModel = require('./models/riderModels');

// Connect to MongoDB (adjust the connection string as needed)
mongoose.connect('mongodb://localhost:27017/ride-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function quickTest() {
    try {
        console.log('🔍 Quick Database Test...\n');

        // Test 1: Check database connection
        console.log('1. Testing database connection...');
        const dbState = mongoose.connection.readyState;
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        console.log(`Database state: ${states[dbState]}`);

        if (dbState !== 1) {
            console.log('❌ Database not connected. Please check your MongoDB connection.');
            return;
        }
        console.log('✅ Database connected successfully\n');

        // Test 2: Count total riders
        console.log('2. Counting riders in database...');
        const totalRiders = await riderModel.countDocuments({});
        console.log(`Total riders found: ${totalRiders}\n`);

        if (totalRiders === 0) {
            console.log('❌ No riders found in database. You need to register some riders first.');
            console.log('💡 Go to the frontend and register a rider account.');
            return;
        }

        // Test 3: Show all riders
        console.log('3. Showing all riders...');
        const allRiders = await riderModel.find({}).select('-password');

        allRiders.forEach((rider, index) => {
            console.log(`\nRider ${index + 1}:`);
            console.log(`  ID: ${rider._id}`);
            console.log(`  Name: ${rider.fullname.firstname} ${rider.fullname.lastname}`);
            console.log(`  Email: ${rider.email}`);
            console.log(`  Status: ${rider.status}`);
            console.log(`  Socket ID: ${rider.socketId || 'None'}`);
            console.log(`  Location: ${JSON.stringify(rider.location)}`);
            console.log(`  Vehicle: ${rider.vehicle.vehicleType} (${rider.vehicle.color})`);
        });

        // Test 4: Check active riders
        console.log('\n4. Checking active riders...');
        const activeRiders = await riderModel.countDocuments({ status: 'active' });
        console.log(`Active riders: ${activeRiders}`);

        // Test 5: Check riders with locations
        console.log('\n5. Checking riders with locations...');
        const ridersWithLocation = await riderModel.countDocuments({
            'location.lat': { $exists: true, $ne: null },
            'location.lng': { $exists: true, $ne: null }
        });
        console.log(`Riders with location: ${ridersWithLocation}`);

        // Test 6: Check riders with socket IDs
        console.log('\n6. Checking riders with socket IDs...');
        const ridersWithSocket = await riderModel.countDocuments({
            socketId: { $exists: true, $ne: null, $ne: '' }
        });
        console.log(`Riders with socket ID: ${ridersWithSocket}`);

        console.log('\n✅ Quick test completed!');

        if (activeRiders === 0) {
            console.log('\n⚠️  WARNING: No active riders found.');
            console.log('   Riders need to connect to the socket to become active.');
        }

        if (ridersWithLocation === 0) {
            console.log('\n⚠️  WARNING: No riders have location data.');
            console.log('   Riders need to update their location via the app.');
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the test
quickTest();

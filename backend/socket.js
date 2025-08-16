const { Server } = require('socket.io');
const riderModel = require('./models/riderModels');
const userModel = require('./models/userModels');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', async (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        // Handle rider joining
        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                console.log(`👤 ${userType} joining: ${userId} with socket: ${socket.id}`);
                console.log(`📊 Join data received:`, data);

                if (userType === 'rider') {
                    console.log(`🏍️ Processing rider join for ID: ${userId}`);

                    // Update rider with socket ID and set as active
                    const rider = await riderModel.findByIdAndUpdate(userId, {
                        socketId: socket.id,
                        status: 'active',
                        lastSeen: new Date()
                    }, { new: true });

                    if (rider) {
                        console.log(`✅ Rider ${rider.fullname.firstname} ${rider.fullname.lastname} connected and active`);
                        console.log(`   Socket ID: ${rider.socketId}`);
                        console.log(`   Status: ${rider.status}`);
                        console.log(`   Location: ${JSON.stringify(rider.location)}`);

                        // Send confirmation to rider
                        socket.emit('rider-connected', {
                            message: 'Successfully connected as rider',
                            riderId: rider._id,
                            status: 'active'
                        });
                    } else {
                        console.log(`❌ Rider not found: ${userId}`);
                        console.log(`🔍 Attempted to find rider with ID: ${userId}`);
                        console.log(`🔍 Available riders in DB:`, await riderModel.find({}).select('_id fullname status socketId'));
                    }
                } else if (userType === 'user') {
                    // Handle user connection
                    const user = await userModel.findByIdAndUpdate(userId, {
                        socketId: socket.id,
                        lastSeen: new Date()
                    }, { new: true });

                    if (user) {
                        console.log(`✅ User ${user.fullname.firstname} ${user.fullname.lastname} connected`);
                        console.log(`   Socket ID: ${user.socketId}`);
                        socket.emit('user-connected', {
                            message: 'Successfully connected as user',
                            userId: user._id
                        });
                    }
                }

                // Join user to a room for targeted messages
                socket.join(userId);
                console.log(`🏠 ${userType} ${userId} joined room: ${userId}`);

            } catch (error) {
                console.error('❌ Error in join event:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });

        // Handle rider location updates
        socket.on('rider-location-update', async (data) => {
            try {
                const { riderId, location } = data;
                console.log(`📍 Rider ${riderId} updating location:`, location);

                // Update rider's location and keep them active
                const rider = await riderModel.findByIdAndUpdate(riderId, {
                    location: location,
                    status: 'active',
                    lastSeen: new Date(),
                    socketId: socket.id // Ensure socket ID is current
                }, { new: true });

                if (rider) {
                    console.log(`✅ Rider ${rider.fullname.firstname} location updated`);
                    console.log(`   New location: (${rider.location.lat}, ${rider.location.lng})`);
                    console.log(`   Status: ${rider.status}`);
                    console.log(`   Socket ID: ${rider.socketId}`);

                    // Confirm location update
                    socket.emit('location-updated', {
                        message: 'Location updated successfully',
                        location: rider.location
                    });
                }
            } catch (error) {
                console.error('❌ Error updating rider location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // Handle rider status updates
        socket.on('rider-status-update', async (data) => {
            try {
                const { riderId, status } = data;
                console.log(`🔄 Rider ${riderId} updating status to: ${status}`);

                const rider = await riderModel.findByIdAndUpdate(riderId, {
                    status: status,
                    lastSeen: new Date()
                }, { new: true });

                if (rider) {
                    console.log(`✅ Rider ${rider.fullname.firstname} status updated to: ${rider.status}`);
                    socket.emit('status-updated', {
                        message: 'Status updated successfully',
                        status: rider.status
                    });
                }
            } catch (error) {
                console.error('❌ Error updating rider status:', error);
                socket.emit('error', { message: 'Failed to update status' });
            }
        });

        // Handle ride acceptance
        socket.on('ride-accepted', async (data) => {
            try {
                const { rideId, riderId, riderName, estimatedTime } = data;
                console.log(`✅ Ride acceptance data received:`, data);
                console.log(`✅ Ride ${rideId} accepted by rider ${riderName}`);

                // Update ride status in database
                const rideModel = require('./models/ride.model');
                await rideModel.findByIdAndUpdate(rideId, {
                    status: 'accepted',
                    rider: riderId
                });

                // Notify user that ride is accepted
                const ride = await rideModel.findById(rideId).populate('user');
                console.log(`🔍 Ride found:`, ride);
                console.log(`🔍 User data:`, ride?.user);
                console.log(`🔍 User socket ID:`, ride?.user?.socketId);

                if (ride && ride.user.socketId) {
                    await sendMessageToSocketId(ride.user.socketId, 'ride-accepted', {
                        rideId: rideId,
                        riderName: riderName,
                        estimatedTime: estimatedTime
                    });
                    console.log(`📨 Ride accepted notification sent to user ${ride.user.fullname.firstname}`);
                } else {
                    console.log(`❌ Cannot notify user: ride=${!!ride}, user=${!!ride?.user}, socketId=${!!ride?.user?.socketId}`);
                }
            } catch (error) {
                console.error('❌ Error handling ride acceptance:', error);
            }
        });

        // Handle ride start
        socket.on('ride-started', async (data) => {
            try {
                const { rideId, riderId, riderName, estimatedTime } = data;
                console.log(`🚀 Ride ${rideId} started by rider ${riderName}`);

                // Update ride status in database
                const rideModel = require('./models/ride.model');
                await rideModel.findByIdAndUpdate(rideId, {
                    status: 'ongoing'
                });

                // Notify user that ride has started
                const ride = await rideModel.findById(rideId).populate('user');
                if (ride && ride.user.socketId) {
                    await sendMessageToSocketId(ride.user.socketId, 'ride-started', {
                        rideId: rideId,
                        riderName: riderName,
                        estimatedTime: estimatedTime
                    });
                    console.log(`📨 Ride started notification sent to user ${ride.user.fullname.firstname}`);
                }
            } catch (error) {
                console.error('❌ Error handling ride start:', error);
            }
        });

        // Handle ride finish
        socket.on('ride-finished', async (data) => {
            try {
                const { rideId, riderId, riderName, distance, duration } = data;
                console.log(`🏁 Ride ${rideId} finished by rider ${riderName}`);
                console.log(`📊 Ride completion data:`, { distance, duration });

                // Update ride status in database with completion data
                const rideModel = require('./models/ride.model');
                const StatsService = require('./services/stats.service');
                
                // Complete the ride with stats
                const completedRide = await StatsService.completeRide(rideId, distance, duration);
                
                if (completedRide) {
                    console.log(`✅ Ride ${rideId} completed successfully`);
                    console.log(`   Distance: ${completedRide.distance} km`);
                    console.log(`   Duration: ${completedRide.duration} minutes`);
                    console.log(`   Rider Earnings: RS ${completedRide.riderEarnings}`);
                }

                // Notify user that ride has finished
                const ride = await rideModel.findById(rideId).populate('user');
                if (ride && ride.user.socketId) {
                    await sendMessageToSocketId(ride.user.socketId, 'ride-finished', {
                        rideId: rideId,
                        riderName: riderName
                    });
                    console.log(`📨 Ride finished notification sent to user ${ride.user.fullname.firstname}`);
                }
            } catch (error) {
                console.error('❌ Error handling ride finish:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);

            try {
                // Find rider by socket ID and mark as inactive
                const rider = await riderModel.findOneAndUpdate(
                    { socketId: socket.id },
                    {
                        status: 'inactive',
                        lastSeen: new Date()
                        // Don't clear socketId - keep it for reconnection
                    }
                );

                if (rider) {
                    console.log(`🚫 Rider ${rider.fullname.firstname} ${rider.fullname.lastname} disconnected`);
                    console.log(`   Status set to: ${rider.status}`);
                    console.log(`   Socket ID kept: ${rider.socketId}`);
                }

                // Also check for users
                const user = await userModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { lastSeen: new Date() }
                );

                if (user) {
                    console.log(`🚫 User ${user.fullname.firstname} ${user.fullname.lastname} disconnected`);
                }

            } catch (error) {
                console.error('❌ Error handling disconnect:', error);
            }
        });

        // Handle reconnection
        socket.on('reconnect', async (data) => {
            try {
                const { userId, userType } = data;
                console.log(`🔄 ${userType} reconnecting: ${userId} with socket: ${socket.id}`);

                if (userType === 'rider') {
                    // Update rider with new socket ID and reactivate
                    const rider = await riderModel.findByIdAndUpdate(userId, {
                        socketId: socket.id,
                        status: 'active',
                        lastSeen: new Date()
                    }, { new: true });

                    if (rider) {
                        console.log(`✅ Rider ${rider.fullname.firstname} reconnected and reactivated`);
                        console.log(`   New Socket ID: ${rider.socketId}`);
                        console.log(`   Status: ${rider.status}`);

                        socket.emit('rider-reconnected', {
                            message: 'Successfully reconnected as rider',
                            riderId: rider._id,
                            status: 'active'
                        });
                    }
                }

                // Rejoin room
                socket.join(userId);

            } catch (error) {
                console.error('❌ Error in reconnect event:', error);
                socket.emit('error', { message: 'Failed to reconnect' });
            }
        });
    });

    console.log('🚀 Socket.io server initialized');
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

const sendMessageToSocketId = async (socketId, event, data) => {
    try {
        if (!io) {
            console.error('❌ Socket.io not initialized');
            return false;
        }

        if (!socketId) {
            console.error('❌ No socket ID provided');
            return false;
        }

        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit(event, data);
            console.log(`✅ Message sent to socket ${socketId}: ${event}`);
            return true;
        } else {
            console.log(`⚠️ Socket ${socketId} not found - may be disconnected`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error sending message to socket:', error);
        return false;
    }
};

const sendMessageToRoom = async (roomId, event, data) => {
    try {
        if (!io) {
            console.error('❌ Socket.io not initialized');
            return false;
        }

        io.to(roomId).emit(event, data);
        console.log(`✅ Message sent to room ${roomId}: ${event}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending message to room:', error);
        return false;
    }
};

module.exports = {
    initializeSocket,
    getIO,
    sendMessageToSocketId,
    sendMessageToRoom
};
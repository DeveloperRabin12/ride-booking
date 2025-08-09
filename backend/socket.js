const socketIo = require('socket.io');
const userModel = require('./models/userModels');
const riderModel = require('./models/riderModels');


let io;


function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        
        socket.on('join', async (data) => {
            const { userId, userType } = data;

              console.log(`User ${userId} join as ${userType}`)

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'rider') {
                await riderModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-rider', async (data)=>{
            const { userId, location } = data;

              if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }
            
            await riderModel.findByIdAndUpdate(userId, {location:{
                lat :location.lat,
                lng :location.lng
            }
        })
            
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}




const sendMessageToSocketId=(socketId, messageObject)=>{

    console.log(`sending message to socketId: ${socketId}`, messageObject)
    if(io){
        io.to(socketId).emit(messageObject.event, messageObject.data);
    }else{
        console.error('Socket.io is not initialized');
    }
}



module.exports = { initializeSocket, sendMessageToSocketId };
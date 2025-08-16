const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    rider: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rider',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted','ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    duration: {
        type:Number,
    },
    distance:{
        type:Number
    },
    // Rider earnings tracking
    riderEarnings: {
        type: Number,
        default: 0
    },
    // Timestamps for stats
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
     paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
        select: false,
        required : true,
    }
})

// Add geospatial index for location-based queries
rideSchema.index({ user: 1, status: 1, createdAt: 1 });
rideSchema.index({ rider: 1, status: 1, createdAt: 1 });

module.exports = mongoose.model('ride',rideSchema)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const riderSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true,
        select: false // Exclude password from queries by default
    },
    socketId: {
        type: String,
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },

    vehicle:{
        color:{
            type: String,
            required: true,
        },
        numberPlate:{
            type: String,
            required: true,
        },
        vehicleType:{
            type:String,
            enum: ['bike', 'car'],
            required: true,
        }
    },

    location:{
        latitude:{
            type: Number,
        },
        longitude:{
            type: Number,
        },
    }

})

riderSchema.methods.generateAuthToken = function () {
     const token = jwt.sign({_id: this._id }, process.env.SECRET_KEY,{expiresIn:'24h'})
        return token;
}

riderSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

riderSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const riderModel = mongoose.model('Rider', riderSchema);
module.exports = riderModel;
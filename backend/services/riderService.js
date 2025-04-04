const riderModel = require('../models/riderModels');





module.exports.createRider = async ({
    firstname, lastname, email, password, vehicleType, color, numberPlate
}) => {
const rider = riderModel.create({
    fullname: {
        firstname,
        lastname
    },
    email,
    password,
    vehicle: {
        vehicleType,
        color,
        numberPlate
    }
})
return rider;
}
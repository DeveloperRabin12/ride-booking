
const mongoose = require('mongoose');

// create function to coonect to our database
function dbConnect () {
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));}

    //exporting the function of connecting databse
module.exports = dbConnect;


const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({  

    firstname: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    socketId: {
        type: String,
       
    }
  });
  
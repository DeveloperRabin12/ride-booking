const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({  

   fullname:{
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
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false // Exclude password from queries by default
    },
    socketId: {
        type: String,
       
    }
  });
  
  //creating a method to generate json web token
  userSchema.methods.generateAuthToken  = function(){
    const token = jwt.sign({_id: this._id }, process.env.SECRET_KEY)
    return token;
  }

  //method to compareing hash password
  userSchema.methods.comparePassword= async function(password) {
   return await bcrypt.compare(password, this.password)
  }

  //method to hsh password
  userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
  }

  const userModel = mongoose.model('User', userSchema);
  module.exports = userModel;
  //exporting the user model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = new mongoose.Schema({
    email: {type:String, required:true, unique: true},
    password: {type:String, required:true, minLength:5},
    
    username: {type:String, required:true, minLength:5, unique: true},
});


const User = mongoose.model('user', user);

module.exports = User;
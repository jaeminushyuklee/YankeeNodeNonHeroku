const mongoose = require('mongoose');
const user = new mongoose.Schema({
    email: {type:String, required:true, unique: true},
    password: {type:String, required:true, minLength:5},
    firstname:{type:String, required:true, minLenght:5},
    lastname:{type:String, required:true, minLenght:5},
    writtenReviews:Array,
});


const User = mongoose.model('user', user);

module.exports = User;
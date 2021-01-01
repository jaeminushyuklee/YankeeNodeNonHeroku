const mongoose = require('mongoose');

const user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String
});

const User = mongoose.model('user', user);

module.exports = User;
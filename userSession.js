const mongoose = require('mongoose');

const userSession = new mongoose.Schema({
    userId:{
        type:Number,
        default: -1
    },
    timestamp:{
        type:Date,
        default:Date.now(),
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
});

const UserSession = mongoose.model('userSession', userSession);

module.exports = UserSession;
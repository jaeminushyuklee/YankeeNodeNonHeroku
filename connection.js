const mongoose = require('mongoose');
require('dotenv').config()

const connectToDB = async()=> {
    await mongoose.connect(process.env.MONGO_URI,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, });
    console.log('We are connected')
}

module.exports = connectToDB;




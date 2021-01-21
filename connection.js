const mongoose = require('mongoose');

const uri = "mongodb+srv://sampleuser:samplepassword@cluster0.ibnsg.mongodb.net/Cluster0?retryWrites=true&w=majority"

const connectToDB = async()=> {
    await mongoose.connect(process.env.MONGOOSEDB_URI || uri,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, });
    console.log('We are connected')
}

module.exports = connectToDB;




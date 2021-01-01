const mongoose = require('mongoose');

const uri = "mongodb+srv://sampleuser:samplepassword@cluster0.ibnsg.mongodb.net/Cluster0?retryWrites=true&w=majority"

const connectToDB = async()=> {
    await mongoose.connect(uri,{ useUnifiedTopology: true, useNewUrlParser: true });
    console.log('We are connected')
}

module.exports = connectToDB;

// mongoose.connection.once('open',function(){
//     console.log('Connection has been made')
// }).on('error', function(error){
//     console.log('error is: ' + error);
// })


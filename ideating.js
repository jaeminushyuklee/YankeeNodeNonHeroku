const mongoose=require("mongoose")
var ReviewSchema = new mongoose.Schema({
  name: String,
  affiliation: String,
  subject: String,
  body: String,
  rating: Number,
  date: String,
  Gqualities: Array,
  Bqualities: Array,
})

var NewInfluencerSchema = new mongoose.Schema({
    ighandle: String,
    reviews: [ReviewSchema]
  });

const newInfluecer = mongoose.model('NewInfluencer', NewInfluencerSchema);
module.exports = newInfluecer;
//you would convert to JSON on the frontend upon receive and iterate through that
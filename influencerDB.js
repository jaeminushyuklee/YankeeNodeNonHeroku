const mongoose = require('mongoose');

const influencer = new mongoose.Schema({
    ighandle: String,
    reviews: [{
        name: String,
        affiliation: String,
        subject: String,
        body: String,
        rating: Number,
        date: String,
        qualities: Array,
      }],
})

const Influencer = mongoose.model('influencer', influencer);

module.exports = Influencer;
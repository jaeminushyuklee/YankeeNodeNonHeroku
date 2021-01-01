const mongoose = require('mongoose');

const influencer = new mongoose.Schema({
    ighandle: String,
    reviews: [{ bodystring: String, rating: String }]
});

const Influencer = mongoose.model('influencer', influencer);

module.exports = Influencer;
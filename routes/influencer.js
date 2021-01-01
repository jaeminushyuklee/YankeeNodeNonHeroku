var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Influencer = require('../influencerDB')

router.post('/submitreview', async(req, res) => {
  const reqighandle = req.body.IGHANDLE;
  const reqreviews = req.body.REVIEW
  const filter = { ighandle: reqighandle};
  const update = { $push: {reviews:reqreviews} };
  try{
    let doc = await Influencer.findOneAndUpdate(filter, update, {
      new: true
    });
    await doc.save();
    res.json(doc);
  } catch(error){
    console.log('therock exists');
    console.log(reqreviews)
    let influencer = {};
    influencer.ighandle = reqighandle;
    influencer.reviews = reqreviews;
    let influencerModel = new Influencer(influencer);
    await influencerModel.save();
    res.json(influencerModel);
  }
  
});

module.exports = router;

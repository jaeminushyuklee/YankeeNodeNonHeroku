var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Influencer = require('../influencerDB')
//testing git
router.post('/submitreview', async(req, res) => {
  const reqighandle = req.body.IGHANDLE;
  
  const reqreviews = req.body.REVIEW
  console.log("yo..." + reqreviews.body)
  const filter = { ighandle: reqighandle};
  const update = { $push: {
    reviews: {
       $each: [reqreviews],
       $position: 0
    }
 }};
  
  try{
    let doc = await Influencer.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true, 
      setDefaultsOnInsert: true
    });
    await doc.save();
    res.json(doc);
  } catch(error){
    console.log(error)
    // var newInfluencer = new Influencer ({
    //   ighandle: reqighandle,
    //   reviews : [] 
    // });
    // newInfluencer.review.$push(reqreviews);
    // newInfluencer.save(function(err){
    //   if(err){
    //       console.log("something went wrog, read below");
    //       console.log(err);
    //   }
    // });
    
    //newInfluencer.save();
    //res.json(newInfluencer);
  
  }
  
});

module.exports = router;

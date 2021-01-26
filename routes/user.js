var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../userDB');
const newInfluencer = require('../ideating');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('248753337271-s4pa70pi1h6pt9pvbuv8f3q6pqr8kut0.apps.googleusercontent.com');
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '248753337271-s4pa70pi1h6pt9pvbuv8f3q6pqr8kut0.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
router.post("/signup", async (req, res, next) => {
  try {
    let { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname || !lastname) {
      return res
        .status(400)
        .json({ msg: "Not all fields have been completed" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "Password needs to be at least 5 characters long" });
    }

    
    const existingUser = await User.findOne({email: email})
    console.log(existingUser);
    if(existingUser){
      return res.status(400).json({ msg: "An account with this email already exists" });
    }
    
    const salt = await bcrypt.genSalt();
    const pwHash = await bcrypt.hash(password,salt);
    
    const newUser = new User({
      email,
      password: pwHash,
      firstname,
      lastname,

    })
    const savedUser = await newUser.save();
    res.json(savedUser);


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login",async(req,res,next)=>{
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({msg:"Not all fields have been completed"})
    }
    var user = await User.findOne({email: email});
    
    
    if(!user){
      return res.status(400).json({msg:"No account with this email"})
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({msg:"Invalid"})
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    res.json({
      token,
      user:{
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      }
    })
    
  }catch(error){
    console.log(error)
  }
})

router.post("/tokenIsValid", async(req,res,next)=>{
  try{
    const token = req.header("x-auth-token");
    if(!token){
      return res.json(false);
    }
    const verified = jwt.verify(token,process.env.JWT_SECRET);
    if(!verified){
      return res.json(false);
    }
    const user = await User.findById(verified.id);
    if(!user){
      return res.json(false);
    }

    return res.json(true);
  }catch(err){
    console.log(err);
  }
})

router.post("/googleTokenIsValid",async(req,res,next)=>{
  try{
    const receivedgoogleToken = req.body.googletoken
    await verify(receivedgoogleToken);
    res.send(true)
  } catch (err){
    res.send(false)
  }
})

router.post("/addedReview", async(req,res,next)=>{
  var user_id = mongoose.Types.ObjectId(req.body.user_id);
  var bundle = req.body.bundle;
  let doc = await User.findByIdAndUpdate(user_id,{$push:{ writtenReviews: {
    $each: [bundle],
    $position: 0
 } }},{upsert:true,new:true,runValidators:true,useFindAndModify:false});
  await doc.save();
  
  res.send("done adding to written reviews")
})

router.post("/getMyReviews", async(req,res)=>{
  const user_id = mongoose.Types.ObjectId(req.body.user_id);
  const Userdoc = await User.findById(user_id).exec();
  const myReviews = Userdoc.writtenReviews;
  var reviewstoSendBack = [];
  for(var i = 0; i < myReviews.length; i++){
    console.log(i);
    const inf = await newInfluencer.findById(mongoose.Types.ObjectId(myReviews[i].ighandle)).exec();
    const rev = await inf.reviews.id(mongoose.Types.ObjectId(myReviews[i].review));
    const infPlusReview = {
      influencer: inf.ighandle,
      influencer_id: myReviews[i].ighandle,
      reviewObj: rev,
    }
    reviewstoSendBack.push(infPlusReview);
    
   
  }
  res.send(reviewstoSendBack);
})

router.post("/deleteReview", async(req,res,next)=>{
  const inf_id = req.body.inf_id;
  const rev_id = req.body.rev_id;
  const user_id = req.body.user_id;
  const inf = await newInfluencer.findById(mongoose.Types.ObjectId(inf_id)).exec();
  inf.reviews.id(mongoose.Types.ObjectId(rev_id)).remove();
  inf.save();
  const user = await User.findByIdAndUpdate(mongoose.Types.ObjectId(user_id),{ $pull: {writtenReviews:{$gte:{ighandle:inf_id,review:rev_id}}}});
  user.writtenReviews.pull({ ighandle: inf_id });
  res.send("done");
})

module.exports = router;

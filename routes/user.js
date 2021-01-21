var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../userDB');
const bcrypt = require('bcrypt-nodejs');
const auth = require('../auth');
router.post("/signup", async (req, res, next) => {
  try {
    let { email, password, passwordConfirm, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ msg: "Not all fields have been completed" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "Password needs to be at least 5 characters long" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ msg: "Password needs to be same" });
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
      username,

    })
    const savedUser = await newUser.save();
    res.json(savedUser);


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login",async(req,res,next)=>{
  try{
    const {emailOrusername, password} = req.body;
    if(!emailOrusername || !password){
      return res.status(400).json({msg:"Not all fields have been completed"})
    }
    var user = null;
    if(emailOrusername.includes('@')){
      user = await User.findOne({email: emailOrusername});
    } else {
      user = await User.findOne({username: emailOrusername});
    }
    
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
        username: user.username,
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

module.exports = router;

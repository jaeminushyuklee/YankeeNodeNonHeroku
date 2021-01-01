var express = require("express");

var router = express.Router();

var returnarray = "";

const spawn = require('child_process').spawn;

const process = spawn('python',['../engagement.py']);

process.stdout.on('data', data => {
    console.log(data.toString());
    returnarray = data.toString();
});

router.get("/",function(req,res,next){
    res.send(returnarray);
});





module.exports=router;
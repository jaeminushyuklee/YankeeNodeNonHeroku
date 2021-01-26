var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var testAPIRouter = require("./routes/getEngagement");
var testpyrouter = require("./routes/testpy");
const { Recoverable } = require("repl");
var app = express();
var connectDB = require("./connection");
const connectToDB = require("./connection");
const Influencer = require("./influencerDB");
const newInfluecer = require("./ideating");
const { use } = require("./routes/index");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/testpython", testpyrouter);
app.use("/getEngagement", require("./routes/getEngagement"));
app.use("/influencer", require("./routes/influencer"));
app.use("/getReviews", require("./routes/getReviews"));

connectToDB();

app.post("/getEngagement", function (req, res) {
  var ighandlereceive = req.body.IGHANDLE;

  console.log("received ig handle is" + ighandlereceive);

  const spawn = require("child_process").spawn;
  if (ighandlereceive != "") {
    console.log("we at least here");
    const process = spawn("python", ["./engagement.py", ighandlereceive]);
    process.stdout.on("data", (data) => {
      console.log(data.toString());
      res.send(JSON.stringify(data.toString()));
    });
  }
});

app.post("/getReviews", function (req, res) {
  var ighandlereceive = req.body.IGHANDLE;
  Influencer.findOne({ ighandle: ighandlereceive }, function (err, influencer) {
    if (err) {
      console.log(err);
    }
    if (!influencer) {
      res.send("No reviews");
    } else {
      res.send(influencer.reviews);
    }
  });
});

app.post("/getReviewsNew", function (req, res) {
  var ighandlereceive = req.body.ighandle;
  newInfluecer.findOne({ ighandle: ighandlereceive }, function (err, influencer) {
    if (err) {
      console.log(err);
    }
    if (!influencer) {
      res.send("No reviews");
    } else if (influencer.reviews.length === 0){
      res.send("No reviews")
    } else {
      res.send(influencer.reviews);
    }
  });
});

app.post('/testnewinf', async function(req,res) {
  const reqighandle = req.body.ighandle;
  const reqreview = req.body.review;
  const update = { $push:{reviews:{$each: [reqreview],
    $position: 0}}};
  
  const foundInfluencer = await newInfluecer.findOneAndUpdate({ ighandle: reqighandle },update,{upsert:true,new:true,runValidators:true});
  const updated = await foundInfluencer.save()
  res.json(updated);
  
    
})

app.post("/testpython", function (req, res) {
  var reviewreceive = req.body.REVIEW;
  console.log("received review is" + reviewreceive);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports.app = app;
//module.exports.app = app;
//module.exports.ighandle = ighandlereceive;

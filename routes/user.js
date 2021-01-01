var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../userDB')

router.post('/', async(req, res) => {
  const {firstName, lastName, email} = req.body;
  let user = {};
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  let userModel = new User(user);
  await userModel.save();
  res.json(userModel);
});

module.exports = router;

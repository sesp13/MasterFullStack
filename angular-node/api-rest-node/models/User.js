'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create UserSchema
const UserSchema = Schema({
  name: String,
  surname: String,
  password: String,
  image: String,
  role: String,
});

//Export module
module.exports = mongoose.model('User', UserSchema);

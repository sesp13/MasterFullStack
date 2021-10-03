'use strict';
const mongoose = require('mongoose');
//Use .env file
const dotenv = require('dotenv');
dotenv.config();

//Work with promises
mongoose.Promise = global.Promise;
//Db connection
mongoose
  .connect(process.env.MONGOCONN)
  .then(() => console.log('Connection successful'))
  .catch((err) => console.log('Error ' + err));

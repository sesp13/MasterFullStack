'use strict';
const mongoose = require('mongoose');
//Use .env file
const dotenv = require('dotenv');
dotenv.config();

//Load server
const app = require('./app');
const port = process.env.PORT || 3999;

//Work with promises
mongoose.Promise = global.Promise;
//Db connection
mongoose
  .connect(process.env.MONGOCONN)
  .then(() => {
    console.log('Connection successful');

    //Turn on the server
    app.listen(port, () => {
      console.log(`Server listening on PORT: ${port}`);
    });
  })
  .catch((err) => console.log('Error ' + err));

'use strict';

//Requires
const express = require('express');

//Use express
const app = express();

//Load routes files

//Middlewares

//Read and parses json in the requests
app.use(express.json());

//CORS

// Rewrite routes

//Test route
app.get('/test', (req, res) => {
  return res.status(200).json({
    name: 'Sesp13',
    message: 'Hello world from NodeJs backend',
  });
});

//Export module
module.exports = app;

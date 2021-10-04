'use strict';

//Requires
const express = require('express');

//Use express
const app = express();

//Load routes files
const userRoutes = require('./routes/user.routes');

//Middlewares

//Read and parses json in the requests
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CORS

// Rewrite routes

//Test route
const apiUrl = '/api';
app.use(apiUrl, userRoutes);

//Export module
module.exports = app;

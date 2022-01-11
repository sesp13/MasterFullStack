'use strict';
const { request, response } = require('express');
const TokenService = require('../services/jwt');

exports.authenticated = function (req = request, res = response, next) {
  // Check if auth is setted
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: `The request doesn't have the headers`,
    });
  }
  // Clear token from quotes
  const token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    const payload = TokenService.validateToken(token);

    req.user = payload;

    // Everything ok
    next();
  } catch (ex) {
    return res.status(401).send({
      message: `Invalid Token`,
    });
  }
};

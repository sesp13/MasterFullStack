'use strict';
const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Midllewares
const md_auth = require('../middlewares/authenticated');

//Get methods
// router.post('register')

//Post Methods
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated, UserController.updateUser);

module.exports = router;

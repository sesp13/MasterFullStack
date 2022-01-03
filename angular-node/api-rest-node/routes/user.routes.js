'use strict';
const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

//Get methods
// router.post('register')

//Post Methods
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', UserController.updateUser);

module.exports = router;

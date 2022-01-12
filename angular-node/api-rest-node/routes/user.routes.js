'use strict';
const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Modules
// Module to upload files sent in the request
const multipart = require('connect-multiparty');

// Midllewares
const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({ uploadDir: './uploads/users/' });
//Get methods
// router.post('register')

//Post Methods
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated, UserController.updateUser);
router.post(
  '/upload-avatar',
  [md_auth.authenticated, md_upload],
  UserController.uploadAvatar
);

module.exports = router;

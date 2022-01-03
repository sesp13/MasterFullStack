'use strict';

const { request, response, json } = require('express');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const TokenService = require('../services/jwt');

class UserController {
  /*
    Creates a new user record
  */
  static save = (req = request, res = response) => {
    const params = req.body;

    //Data validation with validator module
    const validateName = !validator.isEmpty(params.name);
    const validateSurname = !validator.isEmpty(params.surname);
    const validateEmail =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    const validatePassword = !validator.isEmpty(params.password);

    if (
      validateEmail &&
      validateName &&
      validateSurname &&
      validateEmail &&
      validatePassword
    ) {
      const user = new User();
      //Fill user model
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email.toLowerCase();
      user.password = params.password;
      user.role = 'ROLE_USER';
      user.image = null;

      //Check if the user exists
      User.findOne({ email: user.email }, (err, issetUser) => {
        console.log(issetUser);
        if (err)
          return res.status(500).json({
            message: 'Error while double user check',
          });

        if (!issetUser) {
          //Encrypt password
          const salt = bcryptjs.genSaltSync();
          bcryptjs
            .hash(user.password, salt)
            .then((data) => {
              user.password = data;

              //Save user
              user.save((err, userStored) => {
                if (err)
                  return res.status(500).json({
                    message: 'Error while saving user',
                  });

                if (!userStored)
                  return res.status(500).json({
                    message: 'The user was not sabed',
                  });

                //User saved
                return res.status(200).json({
                  status: 'Success',
                  message: 'Save user',
                  user: userStored,
                });
              }); //Close save
            })
            .catch((error) => {
              return res.status(500).json({
                message: 'Error while parsing password',
              });
            }); // Close bcrypt
        } else {
          return res.status(400).json({
            message: 'Error: The user is already registered',
          });
        }
      });
    } else {
      return res.status(400).json({
        message: 'Error: Invalid data input, try again',
      });
    }
  };

  static login = (req = request, res = response) => {
    //Take params from request
    const { password, email, gettoken } = req.body;

    if (!password)
      return res
        .status(400)
        .json({ message: 'password param must be defined' });

    if (!email)
      return res.status(400).json({ message: 'email param must be defined' });

    //Validate data
    const validateEmail = !validator.isEmpty(email) && validator.isEmail(email);
    const validatePassword = !validator.isEmpty(password);

    if (!validateEmail || !validatePassword)
      return res.status(400).json({
        message: 'Invalid input params',
      });

    //Search user who matches with the email
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err)
        return res.status(500).json({
          message: 'Error during user checking',
        });

      if (!user)
        return res.status(404).json({
          message: "Error: The user doesn't exists",
        });

      // Check password
      bcryptjs.compare(password, user.password, (err, success) => {
        if (err)
          return res.status(404).json({
            message: 'Error during password check',
          });

        if (success) {
          //Correct validation
          //Generate JWT
          if (gettoken) {
            return res.status(200).json({
              token: TokenService.createToken(user),
            });
          }

          //Clean object - password
          user.password = undefined;

          //Return user
          return res.status(200).json({
            message: 'Login method',
            status: 'Success',
            user,
          });
        } else {
          //Invalid credentials
          return res.status(404).json({
            message: 'Error: Invalid credentials',
          });
        }
      });
    });
  };

  static updateUser = (req = request, res = response) => {
    return res.status(200).json({
      message: 'Update user',
    });
  };
}

module.exports = UserController;

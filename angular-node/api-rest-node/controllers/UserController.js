'use strict';

const { request, response, json } = require('express');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const TokenService = require('../services/jwt');
const path = require('path');
const fs = require('fs');

class UserController {
  /*
    Creates a new user record
  */
  static save = (req = request, res = response) => {
    const params = req.body;

    //Data validation with validator module
    try {
      var validateName = !validator.isEmpty(params.name);
      var validateSurname = !validator.isEmpty(params.surname);
      var validateEmail =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validatePassword = !validator.isEmpty(params.password);
    } catch (err) {
      return res.status(400).send({ message: 'Missing data' });
    }

    if (validateEmail && validateName && validateSurname && validatePassword) {
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
    try {
      var validateEmail = !validator.isEmpty(email) && validator.isEmail(email);
      var validatePassword = !validator.isEmpty(password);
    } catch (error) {
      return res.status(400).send({ message: 'Missing data' });
    }

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
    // Collect user data
    const params = req.body;

    // Validate data
    try {
      var validateName = !validator.isEmpty(params.name);
      var validateSurname = !validator.isEmpty(params.surname);
      var validateEmail =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch (err) {
      return res.status(400).send({ message: 'Missing data' });
    }

    if (validateEmail && validateName && validateSurname) {
      // Delete unneccesary data
      delete params.password;

      const userId = req.user.sub;

      // Check if the email is unique
      User.findOne({ email: params.email.toLowerCase() }, (err, userFound) => {
        if (err)
          return res.status(500).json({
            message: 'Error during user checking',
          });

        if (
          userFound &&
          userFound.email == params.email &&
          userFound.email != req.user.email
        )
          return res.status(400).json({
            message: 'Error: The email cannot be updated',
          });

        // Find and update user document
        User.findByIdAndUpdate(
          userId,
          params,
          { new: true },
          (err, userUpdated) => {
            if (err || !userUpdated) {
              return res.status(500).json({
                message: 'Error during user update',
              });
            }

            // clean user password
            userUpdated.password = undefined;

            return res.status(200).json({
              message: 'Success the user has been updated',
              user: userUpdated,
            });
          }
        );
      });
    } else {
      return res.status(400).json({
        message: 'Error: Invalid data input, try again',
      });
    }
  };

  static uploadAvatar = async (req = request, res = response) => {
    // Take the file from the request

    // Get the name and the ext from the uploades file
    const defaultFilename = 'No avatar uploaded';

    if (!req?.files?.file0)
      return res.status(400).json({
        message: 'Not files sent',
      });

    // Get path and name
    const filePath = req.files.file0.path;
    // Warning this works in windows
    const fileSplit = filePath.split('\\');
    // Warning this works max/linux
    // const fileSplit = filePath.split('/');

    const filename = fileSplit[2];
    // Get extension
    const extSplit = filename.split('.');
    const fileExt = extSplit[1];

    // Check extension (only images) if it is not valid delete uploaded file
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (!validExtensions.includes(fileExt)) {
      fs.unlink(filePath, (err) => {
        return res.status(400).json({ message: 'Invalid file extension' });
      });
    } else {
      // Get id from authUser
      const userId = req.user.sub;

      // findOne and update user
      User.findByIdAndUpdate(
        userId,
        { image: filename },
        { new: true },
        (err, userUpdated) => {
          if (err)
            return res.status(500).json({
              message: 'Error during user update',
              err,
            });

          //Delete password
          userUpdated.password = undefined;

          // response
          return res
            .status(200)
            .json({ message: 'Success Update Avatar', userUpdated });
        }
      );
    }
  };
}

module.exports = UserController;

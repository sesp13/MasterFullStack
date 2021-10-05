'use strict';
const jwt = require('jwt-simple');
const moment = require('moment');

class TokenService {
  static createToken = (user) => {
    const payload = {
      sub: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      image: user.image,
      iat: moment().unix(),
      exp: moment().add(30, 'days').unix,
    };

    //Create token
    return jwt.encode(payload, process.env.SECRETKEY);
  };
}

module.exports = TokenService;

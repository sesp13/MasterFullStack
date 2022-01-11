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

  static validateToken = (token) => {
    // Decode token
    const payload = jwt.decode(token, process.env.SECRETKEY);

    // Check token's expiration
    if (payload.exp <= moment().unix()) {
      return res.status(400).send({
        message: 'The token has expired',
      });
    }

    return payload;
  };
}
module.exports = TokenService;

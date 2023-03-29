const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errCodeUnauthorized = require('../errors/errCodeUnauthorized');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new errCodeUnauthorized('Неправильная почта или пароль.');
      }

      return user;
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((pass) => {
          if (!pass) {
            throw new errCodeUnauthorized('Неправильная почта или пароль.');
          }
          const token = jwt.sign({ _id: user._id }, 'a71e243eebaec3567de07798fac7b128d837ee48bdbfa1fc03ddb6f867f6b37d', { expiresIn: '7d' });

          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

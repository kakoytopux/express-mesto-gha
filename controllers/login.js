const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errCodeUnauthorized } = require('../utils/const');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject('Неправильная почта или пароль.');
      }

      return user;
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
      .then(pass => {
        if (!pass) {
          return Promise.reject('Неправильная почта или пароль.');
        }
        const token = jwt.sign({ _id: user._id }, 'a71e243eebaec3567de07798fac7b128d837ee48bdbfa1fc03ddb6f867f6b37d', { expiresIn: '7d' });

        res.cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).send({ token });
      })
      .catch((err) => res.status(errCodeUnauthorized).send({ message: err }));
    })
    .catch((err) => res.status(errCodeUnauthorized).send({ message: err }));
};

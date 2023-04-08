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
          const { NODE_ENV, JWT_SECRET } = process.env;

          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key', { expiresIn: '7d' });

          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

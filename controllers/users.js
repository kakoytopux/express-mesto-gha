const bcrypt = require('bcryptjs');
const User = require('../models/user');
const errCodeNotFound = require('../errors/errCodeNotFound');
const errCodeIncorrectData = require('../errors/errCodeIncorrectData');
const errCodeMain = require('../errors/errCodeMain');
const errCodeConflict = require('../errors/errCodeConflict');

const errByDefault = () => new errCodeMain('Внутренняя ошибка!');

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send({ users }))
    .catch(() => next(errByDefault()));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        next(new errCodeNotFound('Запрашиваемый пользователь не найден.'));
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errCodeIncorrectData('Пользователь с указанным _id не найден.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(() => next(errByDefault()));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const {
        // eslint-disable-next-line no-shadow
        name, about, avatar, email, _id,
      } = user;

      res.send({
        user: {
          name, about, avatar, email, _id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errCodeIncorrectData('Переданы некорректные данные при создании пользователя.'));
        return;
      } if (err.code === 11000) {
        next(new errCodeConflict('Такой email уже используется.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new errCodeNotFound('Запрашиваемый пользователь не найден.'));
        return;
      }

      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new errCodeIncorrectData('Переданы некорректные данные при обновлении профиля.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new errCodeNotFound('Запрашиваемый пользователь не найден.'));
        return;
      }

      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new errCodeIncorrectData('Переданы некорректные данные при обновлении аватара.'));
        return;
      }

      next(errByDefault());
    });
};

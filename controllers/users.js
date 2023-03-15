const User = require('../models/user');
const {
  errCodeNotFound, errCodeMain, errCodeIncorrectData,
} = require('../utils/const');
const {
  getJsonHeader,
} = require('../utils/utils');

const errByDefault = (res) => res.status(errCodeMain).send({ message: 'Внутренняя ошибка!' });

module.exports.getUsers = (req, res) => {
  getJsonHeader(res);

  User.find()
    .then((users) => res.send({ users }))
    .catch(() => errByDefault(res));
};

module.exports.getUserId = (req, res) => {
  getJsonHeader(res);

  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(errCodeNotFound).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errCodeIncorrectData).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      errByDefault(res);
    });
};

module.exports.createUser = (req, res) => {
  getJsonHeader(res);

  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errCodeIncorrectData).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }

      errByDefault(res);
    });
};

module.exports.updateProfile = (req, res) => {
  getJsonHeader(res);

  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(errCodeNotFound).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }

      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(errCodeIncorrectData).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }

      errByDefault(res);
    });
};

module.exports.updateAvatar = (req, res) => {
  getJsonHeader(res);

  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(errCodeNotFound).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }

      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(errCodeIncorrectData).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
        return;
      }

      errByDefault(res);
    });
};

const Card = require('../models/card');
const errCodeNotFound = require('../errors/errCodeNotFound');
const errCodeIncorrectData = require('../errors/errCodeIncorrectData');
const errCodeMain = require('../errors/errCodeMain');
const errCodeForbidden = require('../errors/errCodeForbidden');
const { statusCodeCreate } = require('../utils/const');

const errByDefault = () => new errCodeMain('Внутренняя ошибка!');

module.exports.getCards = (req, res, next) => {
  Card.find().populate('owner')
    .then((cards) => res.send({ cards }))
    .catch(() => next(errByDefault()));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(statusCodeCreate).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errCodeIncorrectData('Переданы некорректные данные при создании карточки.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).populate('owner')
    .then((card) => {
      if (card === null) {
        next(new errCodeNotFound('Карточка с указанным _id не найдена.'));
        return;
      }
      if (card.owner._id != req.user._id) {
        next(new errCodeForbidden('Нет прав на удаление карточки.'));
        return;
      }

      return card.deleteOne().then((item) => res.send({ item }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errCodeIncorrectData('Указан недопустимый _id карточки.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate(['likes', 'owner'])
    .then((card) => {
      if (card === null) {
        next(new errCodeNotFound('Передан несуществующий _id карточки.'));
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errCodeIncorrectData('Указан недопустимый _id карточки.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate(['likes', 'owner'])
    .then((card) => {
      if (card === null) {
        next(new errCodeNotFound('Передан несуществующий _id карточки.'));
        return;
      }

      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errCodeIncorrectData('Указан недопустимый _id карточки.'));
        return;
      }

      next(errByDefault());
    });
};

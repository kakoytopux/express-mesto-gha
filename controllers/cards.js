const Card = require('../models/card');
const errCodeNotFound = require('../errors/errCodeNotFound');
const errCodeIncorrectData = require('../errors/errCodeIncorrectData');
const errCodeMain = require('../errors/errCodeMain');
const errCodeForbidden = require('../errors/errCodeForbidden');
const {
  getJsonHeader,
} = require('../utils/utils');

const errByDefault = () => new errCodeMain('Внутренняя ошибка!');

module.exports.getCards = (req, res, next) => {
  getJsonHeader(res);

  Card.find()
    .then((cards) => res.send({ cards }))
    .catch(() => next(errByDefault()));
};

module.exports.createCard = (req, res, next) => {
  getJsonHeader(res);

  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errCodeIncorrectData('Переданы некорректные данные при создании карточки.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.deleteCard = (req, res, next) => {
  getJsonHeader(res);

  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card === null) {
        next(new errCodeNotFound('Карточка с указанным _id не найдена.'));
        return;
      }
      if (card.owner != req.user._id) {
        next(new errCodeForbidden('Нет прав на удаление карточки.'));
        return;
      }

      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errCodeIncorrectData('Карточка с указанным _id не найдена.'));
        return;
      }
      
      next(errByDefault());
    });
};

module.exports.setLike = (req, res, next) => {
  getJsonHeader(res);

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        next(new errCodeNotFound('Карточка с указанным _id не найдена.'));
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errCodeIncorrectData('Передан несуществующий _id карточки.'));
        return;
      }

      next(errByDefault());
    });
};

module.exports.deleteLike = (req, res, next) => {
  getJsonHeader(res);

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        next(new errCodeNotFound('Карточка с указанным _id не найдена.'));
        return;
      }

      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errCodeIncorrectData('Передан несуществующий _id карточки.'));
        return;
      }

      next(errByDefault());
    });
};

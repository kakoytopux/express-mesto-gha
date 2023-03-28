const Card = require('../models/card');
const {
  errCodeNotFound, errCodeMain, errCodeIncorrectData, errCodeUnauthorized
} = require('../utils/const');
const {
  getJsonHeader,
} = require('../utils/utils');

const errByDefault = (res) => res.status(errCodeMain).send({ message: 'Внутренняя ошибка!' });

module.exports.getCards = (req, res) => {
  getJsonHeader(res);

  Card.find()
    .then((cards) => res.send({ cards }))
    .catch(() => errByDefault(res));
};

module.exports.createCard = (req, res) => {
  getJsonHeader(res);

  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errCodeIncorrectData).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
        return;
      }

      errByDefault(res);
    });
};

module.exports.deleteCard = (req, res) => {
  getJsonHeader(res);

  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(errCodeNotFound).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      if (card.owner != req.user._id) {
        res.status(errCodeUnauthorized).send({ message: 'Нет прав на удаление карточки.' });
        return;
      }

      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errCodeIncorrectData).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      errByDefault(res);
    });
};

module.exports.setLike = (req, res) => {
  getJsonHeader(res);

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(errCodeNotFound).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errCodeIncorrectData).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }

      errByDefault(res);
    });
};

module.exports.deleteLike = (req, res) => {
  getJsonHeader(res);

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(errCodeNotFound).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errCodeIncorrectData).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }

      errByDefault(res);
    });
};

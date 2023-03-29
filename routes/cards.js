const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, setLike, deleteLike,
} = require('../controllers/cards');

router.get('/', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
}), getCards);
router.post('/', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri().pattern( /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9--._~:/?#@!$&'()*+,;=\+.~#?&\/=]*)$/),
  })
}), createCard);
router.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })
}), setLike);
router.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })
}), deleteLike);

module.exports = router;

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
    link: Joi.string().required()
  })
}), createCard);
router.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum()
  })
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum()
  })
}), setLike);
router.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum()
  })
}), deleteLike);

module.exports = router;

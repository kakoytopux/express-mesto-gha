const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserId, updateProfile, updateAvatar, getUserMe
} = require('../controllers/users');

router.get('/', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
}), getUsers);
router.get('/me', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
}), getUserMe);
router.get('/:userId', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  params: Joi.object().keys({
    userId: Joi.string().alphanum()
  })
}), getUserId);
router.patch('/me', celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true)
}), updateProfile);
router.patch('/me/avatar',celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json'
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string(),
  })
}), updateAvatar);

module.exports = router;

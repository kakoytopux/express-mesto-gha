const jwt = require('jsonwebtoken');
const { errCodeUnauthorized } = require('../utils/const');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization) {
    return res.status(errCodeUnauthorized).send({
      message: 'Для продолжения необходимо пройти авторизацию.'
    });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'a71e243eebaec3567de07798fac7b128d837ee48bdbfa1fc03ddb6f867f6b37d');
  } catch (err) {
    return res.status(errCodeUnauthorized).send({
      message: 'Для продолжения необходимо пройти авторизацию.'
    });
  }

  req.user = payload;
  
  next();
}
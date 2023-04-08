const jwt = require('jsonwebtoken');
const errCodeUnauthorized = require('../errors/errCodeUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new errCodeUnauthorized('Для продолжения необходимо пройти авторизацию.'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  const { NODE_ENV, JWT_SECRET } = process.env;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key');
  } catch (err) {
    next(new errCodeUnauthorized('Для продолжения необходимо пройти авторизацию.'));
    return;
  }

  req.user = payload;
  next();
};

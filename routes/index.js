const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/users');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const errCodeNotFound = require('../errors/errCodeNotFound');
const { regularExpression } = require('../utils/const');

const defaultMethods = 'GET, HEAD, PUT, PATCH, POST, DELETE';
const allowedCors = [
  'https://mestodd.nomoredomains.monster',
  'http://mestodd.nomoredomains.monster',
];

router.use((req, res, next) => {
  const requestHeaders = req.headers['access-control-request-headers'];
  const { method } = req;
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', defaultMethods);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  next();
});

router.use(requestLogger);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().uri().pattern(regularExpression).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new errCodeNotFound('Неверный запрос.'));
});

router.use(errorLogger);

router.use(errors());

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});

module.exports = router;

const router = require('express').Router();
const {
  getUsers, getUserId, updateProfile, updateAvatar, getUserMe
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', getUserId);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;

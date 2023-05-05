const User = require('../models/User');
const userController = require('../controllers/userController');
const router = require('express').Router();
const protect = require('../middlewares/authMiddleware')

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/lead', protect.authenticate, userController.getLeaderboard)

module.exports = router
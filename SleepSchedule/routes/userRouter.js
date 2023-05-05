const User = require('../models/User');
const userController = require('../controllers/userController');
const router = require('express').Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router
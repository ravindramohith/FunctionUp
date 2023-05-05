const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.signup = async (req, res, next) => {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
    user.password = undefined;
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: user,
        },
    });
}

exports.login = async (req, res) => {
    const username = req.body.username;
    const Password = req.body.password;

    //1) check if username and password exists
    if (!username || !Password) {
        return res.status(400).json({ success: 'fail', message: 'please enter username and password' })
    }
    //2)check if user exists and password is correct
    const user = await User.findOne({ username: username }).select('+password');

    if (!user) {
        return res.status(401).json({ success: 'fail', message: 'user not found' });
    }
    const verify = await user.checkPassword(Password, user.password);
    if (!verify) {
        return res.status(401).json({ success: 'fail', message: 'invalid username or password' });
    }

    //3)check if everything is okay, then send the token to client.

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        user: user,
        token: token,
    });
};


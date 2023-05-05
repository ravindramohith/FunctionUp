const User = require('../models/User');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

exports.authenticate = async (req, res, next) => {
    try {
        let token;
        //getting the token if its there
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ success: 'fail', message: 'you are not logged in' });
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
            return res.status(401).json({ success: 'fail', message: 'the token belonging to the user no longer exists' });
        }
        req.user = freshUser;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            // handle expired token err
            return res.status(401).json({ success: 'fail', message: 'Token expired' });
        }
        // handle other errors
        return res.status(401).json({ success: 'fail', message: 'Invalid token' });
    }
}
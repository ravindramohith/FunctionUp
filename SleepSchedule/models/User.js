const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema(
    {
        username: String,
        password: {
            type: String,
            required: [true, 'Please enter your password'],
            minlength: 8,
            select: false,
        }
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.ConfirmPassword = undefined;
    next();
});

userSchema.methods.checkPassword = async function (
    entered_Password,
    user_Password
) {
    return await bcrypt.compare(entered_Password, user_Password);
};
userSchema.methods.createRandomResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

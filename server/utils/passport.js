const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const sha256 = require('sha256');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function (user, pass, cb) {

    try {
        const user_1 = await User.findOne({
            email: user,
            password: sha256(pass)
        }, '_id rol company');
        if (!user_1)
            return cb(null, false, {
                message: 'Usuario no válido'
            });
        return cb(null, JSON.parse(JSON.stringify(user_1)), {
            message: 'Inicio de sesión correcto'
        });
    } catch (err_1) {
        return cb(err_1);
    }

}));
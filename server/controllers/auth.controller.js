const tokenSecretKey = require('../utils/api.conf').tokenKey;
const jwt = require('jsonwebtoken');
const passport = require('passport');

class AuthController {
    login(req, res) {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.json({
                    error: info ? info.error || info.message : 'Credenciales incorrectas',
                    code: err || user || "No se encontró al usuario"
                });
            } else {
                req.login(user, { session: false }, (err) => {
                    if (err) res.json({ error: err });
                    else {
                        var token = jwt.sign(user, tokenSecretKey, {
                            expiresIn: "24h"
                        });
                        return res.json({ token, user });
                    }
                });
            }
        })(req, res);
    }
    signup(req, res) {
        /*
            Esta función es para crear un nuevo agente,
            pero solo si ellos pueden crear su propia cuenta.
            Si es necesario que alguien mas lo haga, puede simplemente
            realizarlo desde el API del crud de Agentes.
        */
    }
}

module.exports = new AuthController;
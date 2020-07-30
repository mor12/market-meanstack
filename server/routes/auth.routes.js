const express = require('express');
const router = express.Router();

const Auth = require('../controllers/auth.controller');

router.post('/login', Auth.login);
router.post('/signup', Auth.signup);

module.exports = router;
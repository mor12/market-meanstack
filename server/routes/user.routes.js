const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');

router.get('/', user.get);
router.post('/', user.post);
router.put('/', user.put);
router.delete('/:id', user.delete);

router.get('/:id', user.getOne);

module.exports = router;
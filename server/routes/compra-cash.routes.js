const express = require('express');
const router = express.Router();

const compracash = require('../controllers/compra-cash.controller');

router.get('/', compracash.get);
router.post('/', compracash.post);
router.put('/', compracash.put);
router.delete('/:id', compracash.delete);

module.exports = router;

const express = require('express');
const router = express.Router();

const combo = require('../controllers/combo.controller');

router.get('/', combo.get);
router.post('/', combo.post);
router.put('/', combo.put);
router.delete('/:id', combo.delete);

module.exports = router;
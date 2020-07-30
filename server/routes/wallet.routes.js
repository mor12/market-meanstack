const express = require('express');
const router = express.Router();

const wallet = require('../controllers/wallet.controller');

router.get('/', wallet.get);
router.post('/', wallet.post);
router.put('/', wallet.put);
router.delete('/:id', wallet.delete);

module.exports = router;
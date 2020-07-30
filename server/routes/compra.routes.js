const express = require('express');
const router = express.Router();

const compra = require('../controllers/compra.controller');

router.get('/', compra.get);
router.post('/', compra.post);
router.put('/', compra.put);
router.delete('/:id', compra.delete);

router.post('/get-from-api', compra.getComprasAttService)
router.post('/general-detail', compra.generalDetail)

module.exports = router;
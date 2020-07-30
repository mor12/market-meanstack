const express = require('express');
const router = express.Router();

const comprafree = require('../controllers/compra-free.controller');

router.get('/', comprafree.get);
router.post('/', comprafree.post);
router.put('/', comprafree.put);
router.delete('/:id', comprafree.delete);

router.post('/get-from-api', comprafree.getComprasAttService)
router.post('/general-detail', comprafree.generalDetail)

module.exports = router;
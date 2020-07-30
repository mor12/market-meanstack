const express = require('express');
const router = express.Router();

const product = require('../controllers/product.controller');

router.get('/', product.get);
router.post('/', product.post);
router.put('/', product.put);
router.delete('/:id', product.delete);

router.post('/image', product.guardarImagen);


module.exports = router;
const express = require('express');
const router = express.Router();

const category = require('../controllers/category.controller');

router.get('/', category.get);
router.post('/', category.post);
router.put('/', category.put);
router.delete('/:id', category.delete);

module.exports = router;

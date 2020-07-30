const express = require('express');
const router = express.Router();

const schedule = require('../controllers/schedule.controller');

router.get('/', schedule.get);
router.post('/', schedule.post);
router.put('/', schedule.put);
router.delete('/:id', schedule.delete);

module.exports = router;

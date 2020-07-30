const express = require('express');
const router = express.Router();

const employee = require('../controllers/employee.controller');

router.get('/', employee.get);
router.post('/', employee.post);
router.put('/', employee.put);
router.delete('/:id', employee.delete);
router.get('/:id', employee.getById);
router.get('/qr/:qr', employee.getByQr);
router.post('/image', employee.guardarImagen);
router.get('/getComprasActual/:id', employee.getComprasActual);
router.get('/getComprasActualFilter/:id/:date_init/:date_finish', employee.getComprasActualFilterDate);



module.exports = router;
const express = require('express');
const router = express.Router();

const employee = require('../controllers/employee.controller');
const schedule = require('../controllers/schedule.controller');
const report = require('../controllers/report.controller');

router.get('/getByExtOrName/:text', employee.getByExtOrName);
router.post('/setQRCode/:ext/:qr', employee.setQRCode)
router.get('/qr/:qr', employee.getByQr)
router.get('/compras/ext/:ext', employee.getComprasActualByExt)
router.get('/compras/filter/:ext/:dateinit/:datefinish', employee.filterdateext)
router.get('/syncemployees', employee.updateInfoFromJson);
router.get('/generatereport/:date_init/:date_finish', report.generateExcelCompra);
router.get('/generatePlanilla/:date_init/:date_finish', report.generatePlanilla);
router.get('/report/:date_init/:date_finish', report.generateJsonReport)
router.post('/reservate', schedule.post)
module.exports = router;
const express = require('express');
const router = express.Router();

const report = require('../controllers/report.controller');

router.get('/getHistorialActual/:count', report.getHistorialActual);
router.get('/getHistorialActualDateFilter/:count/:date_init/:date_finish', report.getHistorialActualDateFilter);
router.get('/getHistorialActualDateFilterCash/:count/:date_init/:date_finish', report.getHistorialActualDateFilterCash);
router.get('/employeesSalesByHour/:date_init/:date_finish', report.employeesSalesByHour);
router.get('/getTotalCompra', report.getTotalCompra);
router.get('/weekSalesReport', report.weekSalesReport);
router.get('/stadisticsByEmployeeSchedule/:date_init/:date_finish', report.stadisticsByEmployeeSchedule);
router.get('/getTotalCompraDateFilter/:date_init/:date_finish', report.getTotalCompraDateFilter);
router.get('/getTotalCompraCashDateFilter/:date_init/:date_finish', report.getTotalCompraCashDateFilter)

module.exports = router;
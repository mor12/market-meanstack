const express = require('express');
const router = express.Router();

const employee = require('./employee.routes');
const compra = require('./compra.routes');
const comprafree = require('./compra-free.routes');
const product = require('./product.routes');
const category = require('./category.routes');
const combo = require('./combo.routes');
const user = require('./user.routes');
const report = require('./report.routes');
const schedule = require('./schedule.routes');
const compracash = require('./compra-cash.routes');
const wallet = require('./wallet.routes');

router.use('/employee', employee);
router.use('/compra', compra);
router.use('/comprafree', comprafree);
router.use('/category', category);
router.use('/product', product);
router.use('/combo', combo);
router.use('/user', user);
router.use('/report', report);
router.use('/schedule', schedule);
router.use('/compracash', compracash);
router.use('/wallet', wallet);

module.exports = router;


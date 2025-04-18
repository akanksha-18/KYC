const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAllAlerts);
router.post('/', alertController.createAlert);
router.get('/customer/:customerId', alertController.getAlertsByCustomerId);

module.exports = router;
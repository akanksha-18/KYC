const Alert = require('../models/Alert');

exports.getAllAlerts = (req, res) => {
  try {
    const alerts = Alert.getAllAlerts();
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving alerts', error: err.message });
  }
};

exports.createAlert = (req, res) => {
  try {
    const newAlert = Alert.createAlert(req.body);
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ message: 'Error creating alert', error: err.message });
  }
};

exports.getAlertsByCustomerId = (req, res) => {
  try {
    const alerts = Alert.getAlertsByCustomerId(req.params.customerId);
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving alerts', error: err.message });
  }
};
const Customer = require('../models/Customer');

exports.getAllCustomers = (req, res) => {
  try {
    const customers = Customer.getAllCustomers();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving customers', error: err.message });
  }
};

exports.getCustomerById = (req, res) => {
  try {
    const customer = Customer.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving customer', error: err.message });
  }
};

exports.createCustomer = (req, res) => {
  try {
    const newCustomer = Customer.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Error creating customer', error: err.message });
  }
};

exports.updateCustomer = (req, res) => {
  try {
    const updatedCustomer = Customer.updateCustomer(req.params.id, req.body);
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Error updating customer', error: err.message });
  }
};

exports.deleteCustomer = (req, res) => {
  try {
    const result = Customer.deleteCustomer(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer', error: err.message });
  }
};




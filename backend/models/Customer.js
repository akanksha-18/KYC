class Customer {
    constructor() {
      // Initialize with sample data
      this.customers = [
        {
          "customerId": "CUST1001",
          "name": "Alice Johnson",
          "monthlyIncome": 6200,
          "monthlyExpenses": 3500,
          "creditScore": 710,
          "outstandingLoans": 15000,
          "loanRepaymentHistory": [1, 0, 1, 1, 1, 1, 0, 1],
          "accountBalance": 12500,
          "status": "Review"
        },
        {
          "customerId": "CUST1002",
          "name": "Bob Smith",
          "monthlyIncome": 4800,
          "monthlyExpenses": 2800,
          "creditScore": 640,
          "outstandingLoans": 20000,
          "loanRepaymentHistory": [1, 1, 1, 0, 0, 1, 0, 0],
          "accountBalance": 7300,
          "status": "Approved"
        },
        {
          "customerId": "CUST1003",
          "name": "Carol Davis",
          "monthlyIncome": 8500,
          "monthlyExpenses": 4200,
          "creditScore": 780,
          "outstandingLoans": 12000,
          "loanRepaymentHistory": [1, 1, 1, 1, 1, 1, 1, 1],
          "accountBalance": 28000,
          "status": "Review"
        },
        {
          "customerId": "CUST1004",
          "name": "David Wilson",
          "monthlyIncome": 3900,
          "monthlyExpenses": 3200,
          "creditScore": 580,
          "outstandingLoans": 25000,
          "loanRepaymentHistory": [0, 1, 0, 0, 1, 0, 1, 0],
          "accountBalance": 2100,
          "status": "Rejected"
        },
        {
          "customerId": "CUST1005",
          "name": "Emily Brown",
          "monthlyIncome": 7100,
          "monthlyExpenses": 3800,
          "creditScore": 720,
          "outstandingLoans": 30000,
          "loanRepaymentHistory": [1, 1, 1, 0, 1, 1, 1, 1],
          "accountBalance": 15600,
          "status": "Review"
        }
      ];
    }
  
    getAllCustomers() {
      return this.customers;
    }
  
    getCustomerById(id) {
      return this.customers.find(customer => customer.customerId === id);
    }
  
    createCustomer(customerData) {
      const lastId = parseInt(this.customers[this.customers.length - 1].customerId.replace('CUST', ''));
      const newCustomer = {
        ...customerData,
        customerId: `CUST${lastId + 1}`
      };
      this.customers.push(newCustomer);
      return newCustomer;
    }
  
    updateCustomer(id, updatedData) {
      const index = this.customers.findIndex(customer => customer.customerId === id);
      if (index === -1) return null;
      this.customers[index] = { ...this.customers[index], ...updatedData };
      return this.customers[index];
    }
  
    deleteCustomer(id) {
      const index = this.customers.findIndex(customer => customer.customerId === id);
      if (index === -1) return false;
      this.customers.splice(index, 1);
      return true;
    }
  }
  
  // 👇 export an instance, not the class
  module.exports = new Customer();

// models/Customer.js
// const mongoose = require('mongoose');

// const customerSchema = new mongoose.Schema({
//   customerId: { type: String, required: true },
//   name: { type: String, required: true },
//   monthlyIncome: { type: Number, required: true },
//   monthlyExpenses: { type: Number, required: true },
//   creditScore: { type: Number, required: true },
//   outstandingLoans: { type: Number, required: true },
//   loanRepaymentHistory: { type: [Number], required: true },
//   accountBalance: { type: Number, required: true },
//   status: { type: String, required: true }
// });

// // Create a Mongoose model based on the schema
// const Customer = mongoose.model('Customer', customerSchema);

// module.exports = Customer;

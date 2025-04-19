require('dotenv').config(); // Ensure the environment variables are loaded

const mongoose = require('mongoose');
const Customer = require('./models/Customer'); // Import the Mongoose model

// Sample data to insert
const sampleCustomers = [
  {
    customerId: "CUST1001",
    name: "Alice Johnson",
    monthlyIncome: 6200,
    monthlyExpenses: 3500,
    creditScore: 710,
    outstandingLoans: 15000,
    loanRepaymentHistory: [1, 0, 1, 1, 1, 1, 0, 1],
    accountBalance: 12500,
    status: "Review"
  },
  // Add other customers here...
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

const insertSampleData = async () => {
  try {
   
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

  
    const result = await Customer.insertMany(sampleCustomers);

    console.log('Sample data inserted:', result);

    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error inserting sample data:', err);
    mongoose.connection.close();
  }
};

insertSampleData();

// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const connectDB = require('./db'); 

// // Import routes
// const customerRoutes = require('./routes/customerRoutes');
// const alertRoutes = require('./routes/alertRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use('/api/customers', customerRoutes);
// app.use('/api/alerts', alertRoutes);

// // Default route
// app.get('/', (req, res) => {
//   res.send('Credit Risk API is running');
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const customerRoutes = require('./routes/customerRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/alerts', alertRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Credit Risk API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

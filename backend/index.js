const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const customerRoutes = require('./routes/customerRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());


app.use('/api/customers', customerRoutes);
app.use('/api/alerts', alertRoutes);


app.get('/', (req, res) => {
  res.send('Credit Risk API is running');
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

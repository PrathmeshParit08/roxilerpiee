const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/api'); // Ensure the path is correct
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to the Product Transactions API!');
});

// Use the transaction routes
app.use('/api/transactions', transactionRoutes);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product_transactions';
mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error('MongoDB connection error:', error));

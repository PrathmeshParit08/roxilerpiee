const express = require('express');
const axios = require('axios');
const ProductTransaction = require('../models/ProductTransaction'); // Ensure this model is defined correctly
const router = express.Router();

// Initialize database
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Log original transactions for debugging
    console.log('Original Transactions:', transactions);

    // Filter out invalid transactions
    const validTransactions = transactions.filter(transaction => {
      const price = Number(transaction.price);
      return !isNaN(price) && price !== null && price !== '';
    });

    // If there are no valid transactions, return an error response
    if (validTransactions.length === 0) {
      return res.status(400).json({ error: 'No valid transactions found to initialize.' });
    }

    await ProductTransaction.deleteMany({}); // Clear existing data
    await ProductTransaction.insertMany(validTransactions); // Insert new data

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error("Initialization error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all transactions with optional search and pagination
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;

  try {
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search } },
      ],
    };

    const transactions = await ProductTransaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const total = await ProductTransaction.countDocuments(query);

    res.status(200).json({
      transactions,
      total,
      page: Number(page),
      perPage: Number(perPage),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics for a specific month
router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  try {
    const soldItems = await ProductTransaction.countDocuments({
      sold: true,
      dateOfSale: { $regex: new RegExp(`/${month}/`, 'i') }, // Adjusted regex
    });

    const notSoldItems = await ProductTransaction.countDocuments({
      sold: false,
      dateOfSale: { $regex: new RegExp(`/${month}/`, 'i') }, // Adjusted regex
    });

    const totalSaleAmount = await ProductTransaction.aggregate([
      {
        $match: {
          sold: true,
          dateOfSale: { $regex: new RegExp(`/${month}/`, 'i') }, // Adjusted regex
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price' },
        },
      },
    ]);

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get price range data for a specific month
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;

  try {
    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const results = await Promise.all(ranges.map(async (range) => {
      return {
        range: `${range.min}-${range.max}`,
        count: await ProductTransaction.countDocuments({
          price: { $gte: range.min, $lte: range.max },
          dateOfSale: { $regex: new RegExp(`/${month}/`, 'i') }, // Adjusted regex
        }),
      };
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unique categories and item counts for a specific month
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;

  try {
    const results = await ProductTransaction.aggregate([
      {
        $match: {
          dateOfSale: { $regex: new RegExp(`/${month}/`, 'i') }, // Adjusted regex
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch combined data from the three APIs
router.get('/combined', async (req, res) => {
  const { month } = req.query;

  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:5000/api/transactions/statistics?month=${month}`),
      axios.get(`http://localhost:5000/api/transactions/bar-chart?month=${month}`),
      axios.get(`http://localhost:5000/api/transactions/pie-chart?month=${month}`),
    ]);

    res.status(200).json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

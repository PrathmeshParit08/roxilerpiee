const Transaction = require('../models/ProductTransaction');

// Get transactions based on month with search and pagination
const getTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search = '' } = req.query;
  const regex = new RegExp(search, 'i');
  
  const startOfMonth = new Date(`2023-${month}-01`);
  const endOfMonth = new Date(`2023-${parseInt(month) + 1}-01`);

  const query = {
    dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
    $or: [
      { title: regex },
      { description: regex },
      { price: parseInt(search) || { $gte: 0 } }
    ],
  };

  const transactions = await Transaction.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalCount = await Transaction.countDocuments(query);
  
  res.json({ transactions, totalCount });
};

// Get statistics for a specific month
const getStatistics = async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(`2023-${month}-01`);
  const endOfMonth = new Date(`2023-${parseInt(month) + 1}-01`);

  const soldItems = await Transaction.find({
    dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
    sold: true
  }).countDocuments();

  const notSoldItems = await Transaction.find({
    dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
    sold: false
  }).countDocuments();

  const totalSaleAmount = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth }, sold: true } },
    { $group: { _id: null, totalAmount: { $sum: '$price' } } }
  ]);

  res.json({
    totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
    soldItems,
    notSoldItems
  });
};

// API for bar chart
const getBarChart = async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(`2023-${month}-01`);
  const endOfMonth = new Date(`2023-${parseInt(month) + 1}-01`);

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    // Add more ranges as needed
  ];

  const results = [];

  for (const range of priceRanges) {
    const count = await Transaction.countDocuments({
      dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      price: { $gte: range.min, $lt: range.max },
    });
    results.push({ range: range.range, count });
  }

  res.json(results);
};

// API for pie chart
const getPieChart = async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(`2023-${month}-01`);
  const endOfMonth = new Date(`2023-${parseInt(month) + 1}-01`);

  const categories = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.json(categories);
};

// Combine all APIs into one response
const getCombinedData = async (req, res) => {
  const transactions = await getTransactions(req, res);
  const statistics = await getStatistics(req, res);
  const barChart = await getBarChart(req, res);
  const pieChart = await getPieChart(req, res);

  res.json({ transactions, statistics, barChart, pieChart });
};

module.exports = {
  getTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
};

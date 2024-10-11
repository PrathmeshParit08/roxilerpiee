const mongoose = require('mongoose');

const productTransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // price: { type: Number }, // Ensure this is defined as Number
  sold: { type: Boolean, required: true },
  dateOfSale: { type: String, required: true }, // Adjust type as needed
  category: { type: String, required: true },
});

const ProductTransaction = mongoose.model('ProductTransaction', productTransactionSchema);

module.exports = ProductTransaction;

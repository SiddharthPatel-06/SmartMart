const Product = require("../models/Product");
const mongoose = require("mongoose");

// 1. Get products with stock below reorder level
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      quantity: { $lte: mongoose.Types.Decimal128.fromString("20") },
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get products expiring in next 7 days
exports.getExpiringSoon = async (req, res) => {
  try {
    const today = new Date();
    const weekLater = new Date();
    weekLater.setDate(today.getDate() + 7);

    const products = await Product.find({
      expiryDate: { $gte: today, $lte: weekLater },
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get products that need to be reordered
exports.getAutoReorderCandidates = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Search products by name or category
exports.searchProducts = async (req, res) => {
  const { q } = req.query;
  try {
    const regex = new RegExp(q, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { category: regex }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Get category-wise stock summary
exports.getStockByCategory = async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: "$quantity" },
          totalTypes: { $sum: 1 },
        },
      },
      { $sort: { totalItems: -1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

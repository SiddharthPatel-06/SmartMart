const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const moment = require("moment");

// 1. Get total sales for a specific time period
exports.getSalesStats = async (req, res) => {
  try {
    const { range = "daily" } = req.query;
    let groupFormat;

    switch (range) {
      case "daily":
        groupFormat = "%Y-%m-%d";
        break;
      case "weekly":
        groupFormat = "%Y-%U";
        break;
      case "monthly":
        groupFormat = "%Y-%m";
        break;
      default:
        return res.status(400).json({ message: "Invalid range" });
    }

    const sales = await Invoice.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          totalSales: { $sum: "$grandTotal" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Top selling products
exports.getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const topProducts = await Invoice.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          name: "$productInfo.name",
          category: "$productInfo.category",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Least selling products
exports.getLeastSellingProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const leastProducts = await Invoice.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: 1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          name: "$productInfo.name",
          category: "$productInfo.category",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json(leastProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Expiring products
exports.getExpiringProducts = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const expiring = await Product.find({
      expiryDate: { $lte: futureDate, $gte: today },
    }).select("name expiryDate quantity");

    res.status(200).json(expiring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

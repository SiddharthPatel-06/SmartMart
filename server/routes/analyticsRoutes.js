const express = require("express");
const router = express.Router();

const {
  getSalesStats,
  getTopSellingProducts,
  getLeastSellingProducts,
  getExpiringProducts,
} = require("../controllers/analyticsController");

router.get("/sales", getSalesStats);
router.get("/top-products", getTopSellingProducts);
router.get("/least-products", getLeastSellingProducts);
router.get("/expiring-products", getExpiringProducts);

module.exports = router;

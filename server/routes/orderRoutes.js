const express = require("express");
const {
  createOrder,
  updateStatus,
  getOptimizedBatch,
  updateDeliveryLocation,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.put("/status", updateStatus);
router.get("/batch/:martId", getOptimizedBatch);
router.put("/location", updateDeliveryLocation);

module.exports = router;

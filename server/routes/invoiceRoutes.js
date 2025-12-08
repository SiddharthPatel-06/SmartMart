const express = require("express");
const router = express.Router();
const {generateInvoice, getLatestInvoice} = require("../controllers/invoiceController");

router.post("/generate", generateInvoice);
router.get("/latest/:userId", getLatestInvoice);

module.exports = router;
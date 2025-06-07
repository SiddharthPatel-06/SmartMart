const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { createMart } = require("../controllers/martController");

router.post("/", upload.single("logo"), createMart);

module.exports = router;

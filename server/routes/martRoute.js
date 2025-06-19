const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { createMart, getMartById } = require("../controllers/martController");

router.post("/", upload.single("logo"), createMart);
router.get("/:id", getMartById);

module.exports = router;

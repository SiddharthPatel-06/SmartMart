const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const {
  createMart,
  getMartById,
  getMartByOwner,
} = require("../controllers/martController");

router.get("/owner/:id", getMartByOwner);

router.post("/", upload.single("logo"), createMart);
router.get("/:id", getMartById);

module.exports = router;

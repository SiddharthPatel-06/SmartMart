const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { auth } = require("../middlewares/authMiddleware");

// router.use(auth);

// CRUD Routes
router.post("/", createProduct);         
router.get("/", getAllProducts);         
router.get("/:id", getProductById);      
router.put("/:id", updateProduct);      
router.delete("/:id", deleteProduct); 

module.exports = router;

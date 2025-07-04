const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getProductByBarcode,
} = require("../controllers/productController");

const {
  getLowStockProducts,
  getExpiringSoon,
  getAutoReorderCandidates,
  searchProducts,
  getCategories,
} = require("../controllers/productAdvanceController");

const { auth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// router.use(auth);

//Inventory Management
router.get("/low-stock", getLowStockProducts);
router.get("/expiring-soon", getExpiringSoon);
router.get("/search",searchProducts);
router.get("/categories", getCategories);

// CRUD Routes
router.post("/", createProduct);
router.post("/bulk-upload", upload.single("file"),bulkUploadProducts);
router.get("/", getAllProducts);
router.get("/barcode/:barcode", getProductByBarcode);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

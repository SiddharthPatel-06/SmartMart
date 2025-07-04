const express = require("express");
const router = express.Router();
const {
  runAutoReorder,
  getAllReorderRequests,
  updateReorderStatus,
  deleteReorderRequest,
} = require("../controllers/reorderController");

// Admin Routes
router.get("/", getAllReorderRequests); // GET /api/reorders
router.put("/:id", updateReorderStatus); // PUT /api/reorders/:id
router.delete("/:id", deleteReorderRequest); // DELETE /api/reorders/:id
router.post("/run-auto-reorder", runAutoReorder);

module.exports = router;

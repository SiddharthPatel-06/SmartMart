const mongoose = require("mongoose");

const reorderRequestSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    supplier: {
      type: String,
      required: false,
      default: "",
    },
    priority: {
      type: Number,
      default: 0, // 0 = normal, lower = higher priority (like a MinHeap)
    },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("ReorderRequest", reorderRequestSchema);

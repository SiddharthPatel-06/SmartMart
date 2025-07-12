const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    pincode: String,
    state: String,
    country: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    mart: { type: mongoose.Schema.Types.ObjectId, ref: "Mart", required: true },
    items: [orderItemSchema],
    totalAmount: Number,
    customerAddress: addressSchema,
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "dispatched", "delivered", "cancelled"],
      default: "pending",
    },
    history: [{ status: String, changedAt: Date }],
    deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

orderSchema.index({ "customerAddress.location": "2dsphere" });
module.exports = mongoose.model("Order", orderSchema);

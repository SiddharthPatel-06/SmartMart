const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  quantity: Number,
  total: Number,
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [invoiceItemSchema],
    totalAmount: Number,
    gstAmount: Number,
    grandTotal: Number,
    cashierName: String,
    paymentMode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);

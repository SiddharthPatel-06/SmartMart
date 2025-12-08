const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: String,
    contactNo: String,
    city: String,
    pincode: String,
    state: String,
    country: String,
  },
  { _id: false }
);

const martSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logoUrl: String,
    address: addressSchema,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

martSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Mart", martSchema);

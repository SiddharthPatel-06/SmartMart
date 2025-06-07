const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  pincode: String,
  contactNo: String,
  city: String,
  street: String,
  state: String,
  country: String,
});

const martSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: String,
  address: addressSchema,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Mart", martSchema);

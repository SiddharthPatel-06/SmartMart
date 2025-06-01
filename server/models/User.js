const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    pincode: String,
    state: String,
    country: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: {
      type: String,
      enum: ["admin", "billing_staff", "stock_manager"],
      default: "billing_staff",
    },
    profile: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      contactNumber: { type: String, default: "" },
      dateOfBirth: { type: Date },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other",
      },
      address: addressSchema,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

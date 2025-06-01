const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const { auth } = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/change-password", auth, changePassword);

module.exports = router;

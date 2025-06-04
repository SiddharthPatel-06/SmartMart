const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const { otpTemplate } = require("../templates/emailTemplates");
const { passwordChangeNotification } = require("../templates/emailTemplates");

exports.signup = async (req, res) => {
  try {
    const { email, password, role = "billing_staff" } = req.body;

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || !otpRecord.verified) {
      return res.status(400).json({ message: "Email not verified with OTP." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await User.create({
      email,
      password,
      role,
    });

    await Otp.deleteOne({ email });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Signup successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = generateOTP();
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt, verified: false },
      { upsert: true }
    );

    await sendEmail(email, "Your OTP Code", otpTemplate(otpCode));

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP.", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found." });
    }

    if (otpRecord.verified) {
      return res.status(400).json({ message: "OTP already used." });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP.", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found." });
    }

    const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (!otpRecord.verified) {
      return res.status(400).json({ message: "OTP not verified yet." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Otp.deleteOne({ email });

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resetting password.", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    await sendEmail(
      user.email,
      "Password Changed",
      passwordChangeNotification()
    );

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password.", error: error.message });
  }
};

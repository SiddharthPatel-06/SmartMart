const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to SmartMart API");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

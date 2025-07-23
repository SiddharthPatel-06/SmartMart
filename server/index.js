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
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const martRoute = require("./routes/martRoute");
const orderRoutes = require("./routes/orderRoutes");
const reorderRoutes = require("./routes/reorderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/marts", martRoute);
app.use("/api/v1/order", orderRoutes);
app.use("/api/reorders", reorderRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to SmartMart API");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

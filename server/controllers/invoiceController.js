const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Invoice = require("../models/Invoice");
const User = require("../models/User");
const Mart = require("../models/Mart");
const sendEmail = require("../utils/sendEmail");
const { generateInvoiceHTML } = require("../templates/invoiceTemplate");

exports.generateInvoice = async (req, res) => {
  const {
    userId,
    martId,
    cashierName,
    paymentMode,
    sendEmail: sendInvoiceEmail = false,
    customerEmail,
  } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const { items, totalAmount } = cart.items.reduce(
      (acc, item) => {
        if (!item.productId || !item.productId._id) {
          throw new Error("Missing product data in cart item");
        }

        const total = item.quantity * item.productId.price;
        acc.totalAmount += total;
        acc.items.push({
          productId: item.productId._id,
          productName: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          total,
        });
        return acc;
      },
      { items: [], totalAmount: 0 }
    );

    const gstAmount = +(totalAmount * 0.18).toFixed(2);
    const grandTotal = +(totalAmount + gstAmount).toFixed(2);

    const invoice = new Invoice({
      userId,
      items,
      totalAmount,
      gstAmount,
      grandTotal,
      cashierName,
      paymentMode,
      mart: martId,
    });
    await invoice.save();

    cart.items = [];
    await cart.save();

    if (sendInvoiceEmail && customerEmail) {
      const mart = await Mart.findById(martId);
      if (!mart) return res.status(404).json({ message: "Mart not found" });

      const martInfo = {
        name: mart.name,
        address: `${mart.address.street}, ${mart.address.city}, ${mart.address.state} - ${mart.address.pincode}, ${mart.address.country}`,
        contact: mart.address.contactNo,
        logoUrl: mart.logoUrl,
      };

      const html = generateInvoiceHTML(invoice, martInfo);
      await sendEmail(customerEmail, `Your ${mart.name} Invoice`, html);
    }

    res.status(201).json({ message: "Invoice generated", invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name")
      .limit(1);
    if (!invoice) return res.status(404).json({ message: "No invoice found" });

    res.json({ invoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

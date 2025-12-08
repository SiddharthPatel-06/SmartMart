const Product = require("../models/Product");
const csv = require("csv-parser");
const { Readable } = require("stream");
exports.bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required." });
    }

    const products = [];

    const readableFile = new Readable();
    readableFile._read = () => {};
    readableFile.push(req.file.buffer);
    readableFile.push(null);

    readableFile
      .pipe(csv())
      .on("data", (row) => {
        console.log("Parsed row:", row);

        try {
          const product = {
            name: row.name?.trim(),
            sku: row.sku?.trim(),
            description: row.description?.trim() || "",
            category: row.category?.trim(),
            price: parseFloat(row.price),
            quantity: parseInt(row.quantity),
            reorderLevel: parseInt(row.reorderLevel || 5),
            expiryDate: row.expiryDate ? new Date(row.expiryDate) : null,
            supplier: row.supplier?.trim() || "",
            barcode: row.barcode?.trim() || "",
            imageUrl: row.imageUrl?.trim() || "",
          };

          // Basic required field validation
          if (
            !product.name ||
            !product.sku ||
            isNaN(product.price) ||
            isNaN(product.quantity) ||
            !product.category
          ) {
            console.warn("Skipping invalid row:", row);
            return;
          }

          products.push(product);
        } catch (err) {
          console.error("Row parsing error:", err.message);
        }
      })
      .on("end", async () => {
        if (!products.length) {
          return res.status(400).json({ error: "No valid rows found in CSV." });
        }

        try {
          const inserted = await Product.insertMany(products, { ordered: false });
          res.status(201).json({
            message: `${inserted.length} products added successfully.`,
            data: inserted,
          });
        } catch (err) {
          console.error("Database insert error:", err.message);
          res.status(500).json({ error: "Error inserting products: " + err.message });
        }
      })
      .on("error", (err) => {
        console.error("CSV parsing failed:", err.message);
        res.status(500).json({ error: "Failed to parse CSV file." });
      });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
};


// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.stock === "0") {
      filter.quantity = 0; // Out of stock
    } else if (req.query.stock === "in") {
      filter.quantity = { $gt: 0 }; // In stock
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id.trim());
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by barcode
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({ barcode: barcode.trim() });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found with this barcode" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id.trim(),
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id.trim());
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

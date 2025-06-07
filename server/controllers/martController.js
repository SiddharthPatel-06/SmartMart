const Mart = require("../models/Mart");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createMart = async (req, res) => {
  try {
    const { name, address, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({ message: "Name and Owner are required" });
    }

    let logoUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mart_logos",
        public_id: `${owner}-logo`,
        overwrite: true,
      });

      logoUrl = result.secure_url;

      // Optional: delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    const newMart = new Mart({
      name,
      logoUrl,
      address: JSON.parse(address),
      owner,
    });

    const savedMart = await newMart.save();
    res.status(201).json({ message: "Mart created", mart: savedMart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

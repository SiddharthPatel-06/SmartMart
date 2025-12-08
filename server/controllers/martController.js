const Mart = require("../models/Mart");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createMart = async (req, res) => {
  try {
    const { name, address, owner, coordinates } = req.body;

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
      location: {
        type: "Point",
        coordinates: JSON.parse(coordinates),
      },
      owner,
    });

    const savedMart = await newMart.save();
    res.status(201).json({ message: "Mart created", mart: savedMart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMartById = async (req, res) => {
  try {
    const mart = await Mart.findById(req.params.id);
    if (!mart) return res.status(404).json({ message: "Mart not found" });
    res.json({ mart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMartByOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const mart = await Mart.findOne({ owner: ownerId });

    if (!mart) {
      return res.status(404).json({ message: "Mart not found for this owner" });
    }

    res.json({ mart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

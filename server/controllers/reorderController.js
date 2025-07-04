const Product = require("../models/Product");
const ReorderRequest = require("../models/ReorderRequest");

exports.runAutoReorder = async (req, res) => {
  try {
    const productsToReorder = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    });

    const reorderRequests = [];

    for (let product of productsToReorder) {
      const alreadyExists = await ReorderRequest.findOne({
        productId: product._id,
        status: "pending",
      });

      if (!alreadyExists) {
        const reorder = new ReorderRequest({
          productId: product._id,
          sku: product.sku,
          quantity: product.reorderLevel * 2,
        });

        await reorder.save();
        reorderRequests.push(reorder);
      }
    }

    res.status(200).json({
      message: `${reorderRequests.length} reorder requests created.`,
      reorders: reorderRequests,
    });
  } catch (err) {
    console.error("Auto reorder failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all reorder requests with optional filtering
exports.getAllReorderRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const requests = await ReorderRequest.find(filter)
      .sort({ priority: 1, createdAt: -1 })
      .populate("productId", "name category price");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update status of a reorder request
exports.updateReorderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, error } = req.body;

    const updated = await ReorderRequest.findByIdAndUpdate(
      id,
      {
        status,
        error: status === "failed" ? error : null,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Reorder request not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a reorder request
exports.deleteReorderRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ReorderRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

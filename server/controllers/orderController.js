const Order = require("../models/Order");
const Mart = require("../models/Mart");
const { geocodeAddress } = require("../utils/geocode");

// Utility: Format distance in meters/kilometers
function formatDistance(meters) {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(2)} km`;
}

// Utility: Validate coordinates format
function isValidCoordinates(coords) {
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    coords.every((n) => typeof n === "number")
  );
}

// Utility: Haversine formula to get real-world distance in meters
function getDistanceInMeters([lng1, lat1], [lng2, lat2]) {
  const R = 6371000; // Radius of Earth in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 1. Create a new order
exports.createOrder = async (req, res) => {
  const { martId, items, customerAddressText, phone } = req.body;
  if (!martId || !items?.length || !customerAddressText || !phone) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const { coordinates, components, formatted } = await geocodeAddress(
      customerAddressText
    );

    const matchPostcode = formatted?.match(/\b\d{6}\b/);
    const fallbackPostcode = matchPostcode ? matchPostcode[0] : "";

    const totalAmount = items.reduce(
      (sum, i) => sum + i.quantity * (i.price || 0),
      0
    );

    const order = await Order.create({
      mart: martId,
      items,
      totalAmount,
      customerAddress: {
        street: customerAddressText,
        city:
          components.city ||
          components.town ||
          components.village ||
          components.suburb ||
          "",
        pincode:
          components.postcode || components.pincode || fallbackPostcode || "",
        state: components.state || "",
        country: components.country || "",
        location: { type: "Point", coordinates },
      },
      phone,
      history: [{ status: "pending", changedAt: new Date() }],
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Update order status
exports.updateStatus = async (req, res) => {
  const { orderId, status, deliveryPersonId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.history.push({ status, changedAt: new Date() });
    if (deliveryPersonId) order.deliveryPerson = deliveryPersonId;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Optimized route suggestion
exports.getOptimizedBatch = async (req, res) => {
  try {
    const { martId } = req.params;
    const mart = await Mart.findById(martId);
    if (!mart || !isValidCoordinates(mart.location?.coordinates)) {
      return res
        .status(404)
        .json({ message: "Invalid mart or missing coordinates" });
    }

    const orders = await Order.find({
      mart: martId,
      status: "pending",
      "customerAddress.location.coordinates": { $exists: true },
    }).lean();

    const martLoc = mart.location.coordinates;
    const distances = orders
      .map((order) => {
        const customerLoc = order.customerAddress?.location?.coordinates;
        if (!isValidCoordinates(customerLoc)) return null;

        const meters = getDistanceInMeters(martLoc, customerLoc);
        return {
          order,
          distance: formatDistance(meters),
          meters,
        };
      })
      .filter(Boolean);

    distances.sort((a, b) => a.meters - b.meters);
    const optimizedRoute = distances.map((d) => ({
      order: d.order,
      distance: d.distance,
    }));

    res.json({
      mart: {
        _id: mart._id,
        name: mart.name,
        location: mart.location,
      },
      optimizedRoute,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update delivery location
exports.updateDeliveryLocation = async (req, res) => {
  const { orderId, lng, lat } = req.body;

  if (!orderId || typeof lng !== "number" || typeof lat !== "number") {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.customerAddress.location.coordinates = [lng, lat];
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

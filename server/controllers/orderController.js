const Order = require("../models/Order");
const Mart = require("../models/Mart");
const { geocodeAddress } = require("../utils/geocode");

function formatDistance(meters) {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(2)} km`;
}

function isValidCoordinates(c) {
  return (
    Array.isArray(c) && c.length === 2 && c.every((n) => typeof n === "number")
  );
}

/** haversine – great‑circle distance in meters */
function getDistanceInMeters([lng1, lat1], [lng2, lat2]) {
  const R = 6_371_000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

exports.createOrder = async (req, res) => {
  const { martId, items, customerAddressText, phone } = req.body;
  if (!martId || !items?.length || !customerAddressText || !phone) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    /* geocode address → lat/lng */
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

    return res.status(201).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { orderId, status, deliveryPersonId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.history.push({ status, changedAt: new Date() });
    if (deliveryPersonId) order.deliveryPerson = deliveryPersonId;

    await order.save();
    return res.json({ status: order.status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getOptimizedBatch = async (req, res) => {
  try {
    const { martId } = req.params;
    const mart = await Mart.findById(martId);

    if (!mart || !isValidCoordinates(mart.location?.coordinates)) {
      return res
        .status(404)
        .json({ message: "Invalid mart or missing coordinates" });
    }

    /* get all *pending* orders with geo‑coords */
    const pending = await Order.find({
      mart: martId,
      status: "pending",
      "customerAddress.location.coordinates": { $exists: true },
    }).lean();

    const martLoc = mart.location.coordinates;
    const remaining = [...pending];
    const sequence = [];
    let currentLoc = martLoc;

    /* nearest‑neighbour path (O(n²) but fast for ≤ 50‑100 stops) */
    while (remaining.length) {
      let idx = 0;
      let best = Infinity;

      remaining.forEach((ord, i) => {
        const d = getDistanceInMeters(
          currentLoc,
          ord.customerAddress.location.coordinates
        );
        if (d < best) {
          best = d;
          idx = i;
        }
      });

      const [chosen] = remaining.splice(idx, 1);
      sequence.push({
        order: chosen,
        distance: formatDistance(best),
      });
      currentLoc = chosen.customerAddress.location.coordinates;
    }

    return res.json({
      mart: {
        _id: mart._id,
        name: mart.name,
        location: mart.location,
      },
      optimizedRoute: sequence,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

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

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

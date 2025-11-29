import Order from "../models/Order.js";
import { createShipment, getTrackingData } from "../utils/shiprocket.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, shippingAddress } = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
    });

    await newOrder.save();

    // Create shipment in Shiprocket
    try {
      const shipmentDetails = await createShipment(newOrder);
      newOrder.shipmentId = shipmentDetails.shipment_id;
      newOrder.trackingId = shipmentDetails.tracking_id;
      newOrder.trackingUrl = `https://shiprocket.co/tracking/${shipmentDetails.tracking_id}`;
      newOrder.status = "shipped";
      await newOrder.save();
    } catch (shipmentError) {
      // Even if shipment creation fails, the order is still created
      console.error("Shiprocket shipment creation failed:", shipmentError);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order", details: error });
  }
};

// Get order tracking information
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.shipmentId) {
      return res.status(400).json({ error: "Order has not been shipped yet" });
    }

    const trackingData = await getTrackingData(order.shipmentId);
    res.status(200).json({ order, trackingData });
  } catch (error) {
    res.status(500).json({ error: "Failed to track order", details: error });
  }
};

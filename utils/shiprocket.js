import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external";

const getShiprocketToken = async () => {
  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error("Error getting Shiprocket token:", error.response.data);
    throw new Error("Failed to authenticate with Shiprocket");
  }
};

export const createShipment = async (order) => {
  const token = await getShiprocketToken();

  const shipmentData = {
    order_id: order._id.toString(),
    order_date: order.orderedAt.toISOString().split('T')[0],
    pickup_location: process.env.PICKUP_LOCATION_NAME, // Pre-configured on Shiprocket
    billing_customer_name: order.user.name,
    billing_last_name: "",
    billing_address: order.shippingAddress,
    billing_city: "", // These fields should be part of your address model
    billing_pincode: "",
    billing_state: "",
    billing_country: "India",
    billing_email: order.user.email,
    billing_phone: order.user.phoneNumber,
    shipping_is_billing: true,
    order_items: order.items.map(item => ({
      name: item.product.name,
      sku: item.product.sku,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: "Prepaid",
    sub_total: order.totalPrice,
    length: 10, // Dimensions can be generalized or product-specific
    breadth: 10,
    height: 10,
    weight: 1, // Weight in KGs
  };

  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, shipmentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating Shiprocket shipment:", error.response.data);
    throw new Error("Failed to create shipment with Shiprocket");
  }
};

export const getTrackingData = async (shipmentId) => {
  const token = await getShiprocketToken();

  try {
    const response = await axios.get(`${SHIPROCKET_API_URL}/tracking/${shipmentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error getting tracking data from Shiprocket:", error.response.data);
    throw new Error("Failed to get tracking data from Shiprocket");
  }
};

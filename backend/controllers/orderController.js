import Order from "../models/orderModel.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE NEW ORDER
export const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes, deliveryDate } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required" });
    }

    const normalizedPM =
      paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment";

    const orderItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price),
      quantity: Number(i.quantity),
      imageUrl: i.imageUrl,
    }));

    const orderId = `ORD-${uuidv4()}`;
    let newOrder;

    // ------------------ ONLINE PAYMENT -------------------
    if (normalizedPM === "Online Payment") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: orderItems.map((o) => ({
          price_data: {
            currency: "inr",
            product_data: { name: o.name },
            unit_amount: Math.round(o.price * 100), // ₹ to paise
          },
          quantity: o.quantity,
        })),
        customer_email: customer.email,
        success_url: `${process.env.FRONTEND_URL}/myorders/verify?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
        metadata: { orderId },
      });

      newOrder = await Order.create({
        orderId,
        user: req.user?._id || null,
        customer,
        items: orderItems,
        shipping: 0,
        paymentMethod: normalizedPM,
        paymentStatus: "Unpaid",
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        notes,
        deliveryDate,
      });

      return res
        .status(201)
        .json({ order: newOrder, checkoutUrl: session.url });
    }

    // ------------------ COD PAYMENT -------------------
    newOrder = await Order.create({
      orderId,
      user: req.user?._id || null,
      customer,
      items: orderItems,
      shipping: 0,
      paymentMethod: normalizedPM,
      paymentStatus: "Paid",
      notes,
      deliveryDate,
    });

    return res.status(201).json({ order: newOrder, checkoutUrl: null });
  } catch (error) {
    console.error("CreateOrder Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// CONFIRM PAYMENT
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "session_id required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await Order.findOneAndUpdate(
      { sessionId: session_id },
      { paymentStatus: "Paid" },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("ConfirmPayment Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ALL ORDERS
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    console.error("GetOrders Error:", error);
    next(error);
  }
};

// GET ORDER BY ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("GetOrderById Error:", error);
    next(error);
  }
};

// UPDATE ORDER
export const updateOrder = async (req, res, next) => {
  try {
    const allowed = ["status", "paymentStatus", "deliveryDate", "notes"];
    const updateData = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (error) {
    console.error("UpdateOrder Error:", error);
    next(error);
  }
};

// DELETE ORDER
export const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("DeleteOrder Error:", error);
    next(error);
  }
};

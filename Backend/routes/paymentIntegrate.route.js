const { Router } = require("express");
const razorpay = require("razorpay");
const crypto = require("crypto");
const Menu = require("../model/menuSchema");

const paymentRouter = Router();

const createRazorpayClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const priceToPaise = (price) => {
  const match = String(price).match(/^\s*₹?\s*((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?)\s*$/);
  if (!match) {
    throw new Error("Menu item has an invalid price.");
  }

  const [rupees, paise = ""] = match[1].replace(/,/g, "").split(".");
  return Number(rupees) * 100 + Number(paise.padEnd(2, "0"));
};

// Create a Razorpay order using prices stored in the menu, never a client total.
paymentRouter.post("/orders", async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ message: "Payment gateway is not configured." });
  }

  const { items } = req.body || {};
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 50 ||
    items.some(
      (item) =>
        !item ||
        typeof item.id !== "string" ||
        !/^[a-f\d]{24}$/i.test(item.id) ||
        !Number.isSafeInteger(item.qty) ||
        item.qty < 1 ||
        item.qty > 99
    )
  ) {
    return res.status(400).json({ message: "A valid non-empty cart is required." });
  }

  try {
    const client = createRazorpayClient();
    const quantities = new Map();
    for (const item of items) {
      const id = item.id.toLowerCase();
      quantities.set(id, (quantities.get(id) || 0) + item.qty);
    }

    const menuItems = await Menu.find({
      _id: { $in: [...quantities.keys()] },
    })
      .select("_id price")
      .lean();

    if (menuItems.length !== quantities.size) {
      return res.status(400).json({ message: "One or more cart items are unavailable." });
    }

    const amount = menuItems.reduce(
      (total, item) => total + priceToPaise(item.price) * quantities.get(String(item._id)),
      0
    );
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return res.status(400).json({ message: "The cart total is invalid." });
    }

    const order = await client.orders.create({
      amount,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    });

    return res.status(200).json({ data: order });
  } catch (error) {
    console.error("Unable to create Razorpay order:", error);
    return res.status(502).json({ message: "Unable to create a payment order." });
  }
});

paymentRouter.post("/verify", async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ message: "Payment gateway is not configured." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body || {};
  if (
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string" ||
    !/^[a-f\d]{64}$/i.test(razorpay_signature)
  ) {
    return res.status(400).json({ message: "Invalid payment verification details." });
  }

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest();
  const receivedSignature = Buffer.from(razorpay_signature, "hex");

  if (!crypto.timingSafeEqual(expectedSignature, receivedSignature)) {
    return res.status(400).json({ message: "Payment signature verification failed." });
  }

  try {
    const client = createRazorpayClient();
    const [paymentOrder, fetchedPayment] = await Promise.all([
      client.orders.fetch(razorpay_order_id),
      client.payments.fetch(razorpay_payment_id),
    ]);
    let payment = fetchedPayment;
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({ message: "Payment does not match the order." });
    }
    if (
      payment.amount !== paymentOrder.amount ||
      payment.currency !== paymentOrder.currency
    ) {
      return res.status(400).json({ message: "Payment amount does not match the order." });
    }

    if (payment.status === "authorized") {
      payment = await client.payments.capture(
        razorpay_payment_id,
        payment.amount,
        payment.currency
      );
    }

    if (payment.status !== "captured") {
      return res.status(402).json({ message: "Payment has not been captured." });
    }

    return res.status(200).json({
      message: "Payment verified successfully.",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: payment.status,
    });
  } catch (error) {
    console.error("Unable to verify or capture Razorpay payment:", error);
    return res.status(502).json({ message: "Unable to verify payment with the gateway." });
  }
});

module.exports = paymentRouter;

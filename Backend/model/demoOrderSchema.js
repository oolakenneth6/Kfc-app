const { Schema, model } = require("mongoose");

const demoOrderItemSchema = new Schema(
  {
    menuItemId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitAmountPaise: { type: Number, required: true },
  },
  { _id: false }
);

const demoOrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: { type: [demoOrderItemSchema], required: true },
    amountPaise: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    paymentStatus: { type: String, required: true, default: "simulated" },
    orderStatus: { type: String, required: true, default: "demo" },
  },
  { timestamps: true }
);

module.exports = model("DemoOrder", demoOrderSchema);

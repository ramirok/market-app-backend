const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Types.ObjectId },
    data: { type: Object, required: true },
    products: [
      {
        data: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

paymentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.updatedAt;
    delete returnedObject.owner;
    returnedObject.time = returnedObject.data.update_time;
    delete returnedObject.data;
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      data: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

cartSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.owner;
    delete returnedObject._id;
    returnedObject.products = returnedObject.products.map((el) => ({
      ...el.data,
      quantity: el.quantity,
    }));
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

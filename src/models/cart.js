const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [{ quantity: Number, name: String, price: Number }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

cartSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.owner;
    delete returnedObject._id;
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

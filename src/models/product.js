const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },
    sold: { type: Number, required: true, trim: true },
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.category;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
    delete returnedObject.__v;
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

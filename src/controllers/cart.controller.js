const Cart = require("../models/cart");

const getAllCartItems = async (req, res) => {
  try {
    // finds cart by owner id and returns it poulated with products data
    const cart = await Cart.findOne({ owner: req.user.id }).populate({
      path: "products.data",
      select: ["name", "img", "description", "price"],
    });

    // if no cart is found, returns empty array
    res.json(cart ? cart : { products: [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const addCartItem = async (req, res) => {
  let { quantity, id } = req.body;

  try {
    let cart =
      // if the product is in cart, imcrement by quantity
      (await Cart.findOneAndUpdate(
        { owner: req.user.id, "products.data": id },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      )) ||
      // if the product is not in cart, push
      (await Cart.findOneAndUpdate(
        { owner: req.user.id },
        {
          $push: { products: { data: id, quantity } },
        },
        { new: true }
      ));

    // if no cart is found, creates it with the new product
    if (!cart) {
      cart = new Cart({
        products: [{ data: id, quantity }],
        owner: req.user.id,
      });

      await cart.save();
    }

    // populates cart with product data and returns it
    await Cart.populate(cart, {
      path: "products.data",
      select: ["name", "img", "description", "price"],
    });

    return res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const deleteCartItem = async (req, res) => {
  const id = req.params.id;
  try {
    // if cart is found, removes the product by id
    let cart = await Cart.findOneAndUpdate(
      { owner: req.user.id, "products.data": id },
      {
        $pull: { products: { data: id } },
      },
      { new: true }
    );

    // if no cart is found, throws error
    if (!cart) {
      throw new Error("Item not found");
    }

    // populates with product data and returns it
    await Cart.populate(cart, {
      path: "products.data",
      select: ["name", "img", "description", "price"],
    });
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

module.exports = { getAllCartItems, addCartItem, deleteCartItem };

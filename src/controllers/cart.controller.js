const Cart = require("../models/cart");
const expressValidator = require("express-validator");
const limiter = require("../middleware/rateLimiter");

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

const addCartItem = async (req, res, next) => {
  try {
    const quantity = req.body.quantity;
    const id = req.params.id;

    let cart = await Cart.findOne({ owner: req.user.id });

    if (!cart) {
      if (quantity < 1) {
        return res.json({ products: [] });
      }
      cart = new Cart({
        products: [{ data: id, quantity }],
        owner: req.user.id,
      });
    } else {
      // finds product in cart
      const foundIndex = cart.products.findIndex((el) => el.data.equals(id));
      if (foundIndex > -1) {
        const currentAmount = cart.products[foundIndex].quantity;
        cart.products[foundIndex].quantity =
          currentAmount + parseInt(quantity) < 1
            ? currentAmount
            : currentAmount + parseInt(quantity);
      } else {
        if (quantity > 0) {
          cart.products.push({ data: id, quantity });
        }
      }
    }

    await cart.save();
    await Cart.populate(cart, {
      path: "products.data",
      select: ["name", "img", "description", "price"],
    });
    return res.json(cart);
  } catch (error) {
    next(error);
  }
};

const deleteCartItem = async (req, res, next) => {
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
    next(error);
  }
};

module.exports = { getAllCartItems, addCartItem, deleteCartItem };

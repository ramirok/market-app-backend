const router = require("express").Router();
const Cart = require("../models/cart");
const auth = require("../middleware/auth");

router.get("/cart", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ owner: req.user.id });
    res.json(cart ? cart : { products: [] });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/cart", auth, async (req, res) => {
  const { quantity, name, price } = req.body; //{name,price,quantity}
  try {
    // let cart = await Cart.findOne({ owner });
    let cart = await Cart.findOne({ owner: req.user.id });

    if (cart) {
      let itemIndex = cart.products.findIndex((p) => p.name === name);

      if (itemIndex > -1) {
        // let productItem = cart.products[itemIndex];
        // productItem.quantity = quantity;
        // cart.products[itemIndex] = productItem;
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ quantity, name, price });
      }
      cart = await cart.save();
      return res.status(201).json(cart);
    } else {
      const newCart = await Cart.create({
        owner: req.user.id,
        products: [{ quantity, name, price }],
      });

      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error.message);

    res.status(400).send("Something went wrong");
  }
});

router.delete("/cart/:item", auth, async (req, res) => {
  const item = req.params.item;
  try {
    let cart = await Cart.findOne({ owner: req.user.id });
    if (cart) {
      let itemIndex = cart.products.findIndex((p) => p.name === item);
      if (itemIndex > -1) {
        cart.products.splice(itemIndex, 1);
        cart = await cart.save();
        return res.status(203).json(cart);
      }
    }
    res.status(404).send("not found");
  } catch (error) {
    console.log(eror);
    res.status(400).send("Something went wrong");
  }
});

module.exports = router;

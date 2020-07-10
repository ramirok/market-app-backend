const router = require("express").Router();
const Cart = require("../models/cart");
const auth = require("../middleware/auth");

router.get("/cart", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ owner: req.user.id }).populate({
      path: "products.data",
      select: ["name", "img", "description", "price"],
    });

    res.json(cart ? cart : { products: [] });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({ error: error.message });
  }
});

router.post("/cart", auth, async (req, res) => {
  let { quantity, id } = req.body;
  quantity = quantity === 0 ? 1 : quantity;

  try {
    let cart =
      (await Cart.findOneAndUpdate(
        { owner: req.user.id, "products.data": id },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      )) ||
      (await Cart.findOneAndUpdate(
        { owner: req.user.id },
        {
          $push: { products: { data: id, quantity } },
        },
        { new: true }
      ));

    if (!cart) {
      cart = new Cart({
        products: [{ data: id, quantity }],
        owner: req.user.id,
      });

      await cart.save();
    }

    await Cart.populate(cart, {
      path: "products.data",
      select: ["name", "img", "description", "price"],
    });
    return res.status(201).json(cart);
  } catch (error) {
    console.log(error);

    res.status(400).send("Something went wrong");
  }
});

router.delete("/cart/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    let cart = await Cart.findOneAndUpdate(
      { owner: req.user.id, "products.data": id },
      {
        $pull: { products: { data: id } },
      },
      { new: true }
    );

    if (!cart) {
      throw new Error("Item not found");
    }

    await Cart.populate(cart, {
      path: "products.data",
      select: ["name", "img", "description", "price"],
    });

    res.status(203).json(cart);
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});

module.exports = router;

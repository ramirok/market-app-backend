const router = require("express").Router();
const Product = require("../models/product");

router.post("/admin", async (req, res) => {
  const product = new Product({
    category: req.body.category,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    img: req.body.img,
    sold: req.body.sold ? req.body.sold : 0,
  });
  try {
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;

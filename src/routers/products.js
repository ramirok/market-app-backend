const router = require("express").Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/products", async (req, res) => {
  if (req.query.sortBy) {
    const response = await Product.find({})
      .sort({ [req.query.sortBy]: -1 })
      .limit(6);
    return res.json(response);
  }

  try {
    const response = await Product.find({}).limit(30);
    res.json(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/products/cart", async (req, res) => {
  const arrayToFind = req.query.p;
  console.log(arrayToFind[0]);

  try {
    const productsFound = await Product.find({
      name: {
        $in: arrayToFind,
      },
    });
    res.json(productsFound);
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
});

router.get("/products/autosuggest", async (req, res) => {
  const q = req.query.q;
  const reg = new RegExp(q);

  try {
    const productFound = await Product.find({ name: { $regex: reg } });

    res.json(productFound);
  } catch (error) {
    res.json([]);
    console.log(error.message);
  }
});

router.get("/products/:item", async (req, res) => {
  const item = req.params.item;
  try {
    const itemFound = await Product.findOne({ name: item });

    if (!itemFound) {
      return res.status(404).end();
    }
    res.json(itemFound);
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
});

router.get("/products/cat/:category", async (req, res) => {
  const category = req.params.category;
  try {
    const response = await Product.find({ category });
    res.json(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;

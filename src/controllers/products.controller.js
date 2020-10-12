const Product = require("../models/product");
const expressValidator = require("express-validator");

const getProducts = async (req, res) => {
  res.header({ "Cache-Control": "no-cache" });
  try {
    // if req has sortBy query
    if (req.query.sortBy) {
      const response = await Product.find({})
        .sort({ [req.query.sortBy]: -1 })
        .limit(6);
      return res.json(response);
    }

    // if req has no query
    const response = await Product.find({}).limit(30);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const getProductsSuggestions = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });
  // if validator middleware has error, return empty array
  if (!errors.isEmpty()) return res.json([]);

  // creates a regex with the q query
  const q = req.query.q;
  const reg = new RegExp(q, "i");

  try {
    // finds products by regex
    const productFound = await Product.find({ name: { $regex: reg } });

    res.json(productFound);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const getProductsCategory = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });
  // if validator middleware has error, return empty array
  if (!errors.isEmpty()) {
    return res.json([]);
  }

  // get category from url param
  const category = req.params.category;

  try {
    // return array of found category items, if not found return empry array
    const response = await Product.find({ category });
    res.json(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductsSuggestions,
  getProductsCategory,
};

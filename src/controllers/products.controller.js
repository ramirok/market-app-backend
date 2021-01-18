const Product = require("../models/product");
const expressValidator = require("express-validator");

const getProducts = async (req, res, next) => {
  res.header({ "Cache-Control": "no-cache" });
  try {
    // if req has sortBy query
    if (req.query.sortBy) {
      const response = await Product.find({})
        .sort({ [req.query.sortBy]: -1 })
        .limit(6);
      return res.json(response);
    }

    // if req has no sortBy query
    const response = await Product.find({}).limit(30);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getProductsSuggestions = async (req, res, next) => {
  // creates a regex with the q query
  const q = req.query.q;
  const reg = new RegExp(q, "i");

  try {
    // finds products by regex
    const productFound = await Product.find({ name: { $regex: reg } });

    res.json(productFound);
  } catch (error) {
    next(error);
  }
};

const getProductsCategory = async (req, res, next) => {
  // get category from url param
  const category = req.params.category;

  try {
    // return array of found category items, if not found return empry array
    const response = await Product.find({ category });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsSuggestions,
  getProductsCategory,
};

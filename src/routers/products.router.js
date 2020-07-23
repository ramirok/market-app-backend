const router = require("express").Router();
const validate = require("../middleware/validation");

const {
  getProducts,
  getProductsSuggestions,
  getProductsCategory,
} = require("../controllers/products.controller");

// get products data
router.get("/", validate("sortProducts"), getProducts);

// get searchBar suggestions
router.get("/autosuggest", validate("suggestProducts"), getProductsSuggestions);

// get products by category
router.get("/cat/:category", validate("categorySearch"), getProductsCategory);

module.exports = router;

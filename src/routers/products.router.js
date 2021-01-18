const router = require("express").Router();
const { validate, checkValidationErrors } = require("../middleware/validation");

const {
  getProducts,
  getProductsSuggestions,
  getProductsCategory,
} = require("../controllers/products.controller");

router
  // get products data
  .get("/", validate("sortProducts"), checkValidationErrors, getProducts)

  // get searchBar suggestions
  .get(
    "/autosuggest",
    validate("suggestProducts"),
    checkValidationErrors,
    getProductsSuggestions
  )

  // get products by category
  .get(
    "/cat/:category",
    validate("categorySearch"),
    checkValidationErrors,
    getProductsCategory
  );

module.exports = router;

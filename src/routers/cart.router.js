const router = require("express").Router();
const auth = require("../middleware/auth");
const { validate, checkValidationErrors } = require("../middleware/validation");

const {
  getAllCartItems,
  addCartItem,
  deleteCartItem,
} = require("../controllers/cart.controller");

router
  // get cart
  .get("/", auth, getAllCartItems)

  // add product to the cart
  .post(
    "/:id",
    auth,
    validate("addCartItem"),
    checkValidationErrors,
    addCartItem
  )

  // remove product from the cart
  .delete(
    "/:id",
    auth,
    validate("delCartItem"),
    checkValidationErrors,
    deleteCartItem
  );

module.exports = router;

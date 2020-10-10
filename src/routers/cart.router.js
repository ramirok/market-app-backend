const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validation");

const {
  getAllCartItems,
  addCartItem,
  deleteCartItem,
} = require("../controllers/cart.controller");

// get cart
router.get("/", auth, getAllCartItems);

// add product to the cart
router.post("/:id", auth, validate("addCartItem"), addCartItem);

// remove product from the cart
router.delete("/:id", auth, validate("delCartItem"), deleteCartItem);

module.exports = router;

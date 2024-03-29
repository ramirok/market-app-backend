const router = require("express").Router();
const auth = require("../middleware/auth");
const { validate, checkValidationErrors } = require("../middleware/validation");

const {
  getAllCartItems,
  addCartItem,
  deleteCartItem,
} = require("../controllers/cart.controller");

const RequestQ = require("express-request-queue");
const qAdd = new RequestQ({ unique: true, from: "user", name: "_id" });
const qDel = new RequestQ({ unique: true, from: "user", name: "_id" });

router
  // get cart
  .get("/", auth, getAllCartItems)

  // add product to the cart
  .post(
    "/:id",
    auth,
    validate("addCartItem"),
    checkValidationErrors,
    qAdd.run(addCartItem)
  )

  // remove product from the cart
  .delete(
    "/:id",
    auth,
    validate("delCartItem"),
    checkValidationErrors,
    qDel.run(deleteCartItem)
  );

module.exports = router;

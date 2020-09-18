const { body, query, param } = require("express-validator");
const Cart = require("../models/cart");
const Product = require("../models/product");

const checkEmail = () => {
  // check if email is a valid email address
  return body("email")
    .isEmail()
    .withMessage("Must provide a valid email address.")
    .normalizeEmail();
};

const checkName = () => {
  // check name has a leats 4 characters
  return body("name")
    .isLength({ min: 4 })
    .withMessage("Name must be 4 charactes minimun.");
};

const checkPassword = () => {
  // check if password has a least 6 characters, 1 letter and 1 digit
  return body(
    "password",
    "Password must have 6 characters, 1 digit and 1 letter."
  )
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/);
};

const checkPasswordConfirmation = () => {
  // check if confirmation password matches password
  return body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match new password.");
    }
    return true;
  });
};

const checkItemQuantityAndId = async (req, res, next) => {
  let { id, quantity } = req.body;

  try {
    // check if id is a valid product id, else throw error
    const productExist = await Product.findById(id);

    if (!productExist) {
      throw new Error();
    }

    // check if quantity is an integer, else throw error
    if (isNaN(parseInt(quantity))) {
      throw new Error();
    }

    // finds cart by owner
    const cart = await Cart.findOne({ owner: req.user.id });

    if (!cart) {
      // if no cart is found, quantiy must be > 0
      req.body.quantity = quantity < 1 ? 1 : quantity;
      return next();
    }

    // finds product in cart
    const foundIndex = cart.products.findIndex((el) => el.data.equals(id));

    foundIndex > -1
      ? // if the product is found in the cart, check that incrementing quantity doens't become < 1 (quantity in request can be negative)
        (req.body.quantity =
          cart.products[foundIndex].quantity + parseInt(quantity) < 1
            ? 0
            : quantity)
      : // if the product is not found in the cart, quantity must be > 0
        (req.body.quantity = quantity < 1 ? 1 : quantity);

    next();
  } catch (error) {
    res.status(400).json({ message: "Failed, please try again." });
  }
};

const checkItemId = async (req, res, next) => {
  const id = req.params.id;

  // check if id is a valid product id, else throw error
  const productExist = await Product.findById(id);
  try {
    if (!productExist) {
      throw new Error();
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Failed, please try again." });
  }
};

const checkSortQuery = (req, res, next) => {
  // if request has query, only accepts sortBy, else return empty object
  if (Object.entries(req.query).length > 0) {
    if (!req.query.hasOwnProperty("sortBy")) {
      return res.json({});
    }
  }
  next();
};

const checkSearchQuery = () => {
  // check search query has only letters
  return query("q").isAlpha();
};

const checkCategory = () => {
  // check category param has only letters
  return param("category").isAlpha();
};

checkPersonalInfo = () => {
  return [
    body("fullName")
      .if(body("fullName").exists({ checkFalsy: true, checkNull: true }))
      .escape(),
    body("phoneNumber")
      .if(body("phoneNumber").exists({ checkFalsy: true }))
      .escape()
      .isNumeric(),
    body("state")
      .if(body("state").exists({ checkFalsy: true }))
      .escape(),
    body("city")
      .if(body("city").exists({ checkFalsy: true }))
      .escape(),
    body("zipCode")
      .if(body("zipCode").exists({ checkFalsy: true }))
      .escape()
      .isNumeric(),
    body("street")
      .if(body("street").exists({ checkFalsy: true }))
      .escape(),
    body("streetNumber")
      .if(body("streetNumber").exists({ checkFalsy: true }))
      .escape()
      .isNumeric(),
  ];
};

const validate = (method) => {
  switch (method) {
    case "createUser":
      return [checkName(), checkEmail(), checkPassword()];
    case "loginUser":
      return [checkEmail()];
    case "forgotPass":
      return [checkEmail()];
    case "resetPass":
      return [checkPassword(), checkPasswordConfirmation()];
    case "changePass":
      return [checkPassword(), checkPasswordConfirmation()];
    case "addCartItem":
      return checkItemQuantityAndId;
    case "delCartItem":
      return checkItemId;
    case "sortProducts":
      return checkSortQuery;
    case "suggestProducts":
      return [checkSearchQuery()];
    case "categorySearch":
      return [checkCategory()];
    case "userData":
      return [checkPersonalInfo()];
    case "postHistory":
      return checkItemId;
    default:
      break;
  }
};

module.exports = validate;

const { body, query, param, validationResult } = require("express-validator");
const Cart = require("../models/cart");
const Product = require("../models/product");
const mongoose = require("mongoose");
const { badRequestError } = require("../utils/errors");

const checkEmail = () => {
  // check if email is a valid email address
  return body("email", "Must provide a valid email address.").isEmail();
};

const checkName = () => {
  // check name has a leats 4 characters
  return body("name", "Name must be 4 charactes minimun.")
    .isLength({
      min: 4,
    })
    .isAlphanumeric()
    .withMessage("UserName allows only alphanumeric charactes");
};

const checkPassword = () => {
  // check if password has a least 6 characters, 1 letter and 1 digit
  return body(
    "password",
    "Password must have 6 characters, 1 digit and 1 letter."
  )
    .isLength({ min: 6 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)([\s\S]{6,})$/);
};

const checkPasswordConfirmation = () => {
  // check if confirmation password matches password
  return body(
    "passwordConfirmation",
    "Password confirmation does not match new password."
  ).custom((value, { req }) => {
    if (value !== req.body.password) {
      return false;
    }
    return true;
  });
};

const checkItemQuantity = () => {
  return body("quantity", "Failed, please try again.").isInt();
};

const checkItemId = () => {
  return param("id", "Failed, please try again.")
    .isMongoId()
    .custom((value) => {
      return Product.findById(value).then((product) => {
        if (!product) {
          return Promise.reject("Failed, please try again.");
        }
      });
    });
};

const checkSortQuery = () => {
  return query("sortBy", "Failed, please try again.")
    .optional()
    .isIn(["sold", "createdAt"]);
};

const checkSearchQuery = () => {
  // check search query has only letters
  return query("q").isAlpha();
};

const checkCategory = () => {
  // check category param has only letters
  return param("category").isIn([
    "vegetables",
    "snacks",
    "fruits",
    "spices",
    "canned-products",
  ]);
};

const checkPersonalInfo = () => {
  return [
    body("fullName")
      .if(body("fullName").exists({ checkFalsy: true, checkNull: true }))
      .isLength({ min: 4 })
      .matches(/^[a-z ,.'-]*$/i),
    body("phoneNumber")
      .if(body("phoneNumber").exists({ checkFalsy: true }))
      .matches(/^[0-9\s+\-().]*$/),
    body("state")
      .if(body("state").exists({ checkFalsy: true }))
      .isLength({ min: 4 }),
    body("city")
      .if(body("city").exists({ checkFalsy: true }))
      .isLength({ min: 4 }),
    body("zipCode")
      .if(body("zipCode").exists({ checkFalsy: true }))
      .isNumeric()
      .isLength({ min: 4 }),
    body("street")
      .if(body("street").exists({ checkFalsy: true }))
      .isLength({ min: 4 }),
    body("streetNumber")
      .if(body("streetNumber").exists({ checkFalsy: true }))
      .isNumeric(),
  ];
};

const checkJWT = () => {
  return body("token", "Invalid token").isJWT();
};

const checkResetLink = () => {
  return body("resetLink").isJWT();
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
      return [checkPassword(), checkPasswordConfirmation(), checkResetLink()];
    case "changePass":
      return [checkPassword(), checkPasswordConfirmation()];
    case "addCartItem":
      return [checkItemId(), checkItemQuantity()];
    case "delCartItem":
      return checkItemId();
    case "sortProducts":
      return checkSortQuery();
    case "suggestProducts":
      return [checkSearchQuery()];
    case "categorySearch":
      return [checkCategory()];
    case "userData":
      return [checkPersonalInfo()];
    case "postHistory":
      return checkItemId();
    case "checkToken":
      return checkJWT();
    default:
      break;
  }
};

const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  throw new badRequestError(errors.array()[0].msg);
};

module.exports = { validate, checkValidationErrors };

const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createUser,
  activateUser,
  loginUser,
  loginUserGoogle,
  forgotPass,
  resetPass,
  logoutUser,
  logoutUserFromAll,
  changePass,
  getUserInfo,
  putUserInfo,
  createPurchaseOrder,
  resetCart,
  orders,
  postHistory,
  getHistory,
} = require("../controllers/user.controller");

const { validate, checkValidationErrors } = require("../middleware/validation");

router
  // create new user
  .post("/", validate("createUser"), checkValidationErrors, createUser)

  // activate new user account
  .post(
    "/activate",
    validate("checkToken"),
    checkValidationErrors,
    activateUser
  )

  // login user
  .post("/login", validate("loginUser"), checkValidationErrors, loginUser)

  // login with google
  .get("/login/google", loginUserGoogle)

  // forgot password
  .post(
    "/forgot-pass",
    validate("forgotPass"),
    checkValidationErrors,
    forgotPass
  )

  // reset password
  .put("/reset-pass", validate("resetPass"), checkValidationErrors, resetPass)

  // logout user
  .post("/logout", auth, logoutUser)

  // logout from all other devices
  .post("/logoutAll", auth, logoutUserFromAll)

  // change password (when logged in)
  .put(
    "/change",
    auth,
    validate("changePass"),
    checkValidationErrors,
    changePass
  )

  // get user details (personal data and address)
  .get("/user-details", auth, getUserInfo)

  // update user details (personal data and address)
  .put(
    "/user-details",
    auth,
    validate("userData"),
    checkValidationErrors,
    putUserInfo
  )

  // new payments
  .post("/purchase-aproved", auth, createPurchaseOrder)

  // reset user's cart
  .post("/reset-cart", auth, resetCart)

  // query user's orders
  .get("/orders", auth, orders)

  // save seen before items
  .post(
    "/history/:id",
    auth,
    validate("postHistory"),
    checkValidationErrors,
    postHistory
  )

  // get seen before items
  .get("/history", auth, getHistory);

module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createUser,
  activateUser,
  loginUser,
  forgotPass,
  ResetPass,
  logoutUser,
  logoutUserFromAll,
  changePass,
} = require("../controllers/user.controller");

const validate = require("../middleware/validation");

// create new user
router.post("/", validate("createUser"), createUser);

// activate new user account
router.post("/activate", activateUser);

// login user
router.post("/login", validate("loginUser"), loginUser);

// forgot password
router.post("/forgot-pass", validate("forgotPass"), forgotPass);

// reset password
router.put("/reset-pass", validate("resetPass"), ResetPass);

// logout user
router.post("/logout", auth, logoutUser);

// logout from all other devices
router.post("/logoutAll", auth, logoutUserFromAll);

// change password (when logged in)
router.put("/change", validate("changePass"), auth, changePass);

module.exports = router;

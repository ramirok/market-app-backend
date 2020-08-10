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
} = require("../controllers/user.controller");

const validate = require("../middleware/validation");

// create new user
router.post("/", validate("createUser"), createUser);

// activate new user account
router.post("/activate", activateUser);

// login user
router.post("/login", validate("loginUser"), loginUser);

// login with google
router.get("/login/google", loginUserGoogle);

// forgot password
router.post("/forgot-pass", validate("forgotPass"), forgotPass);

// reset password
router.put("/reset-pass", validate("resetPass"), resetPass);

// logout user
router.post("/logout", auth, logoutUser);

// logout from all other devices
router.post("/logoutAll", auth, logoutUserFromAll);

// change password (when logged in)
router.put("/change", validate("changePass"), auth, changePass);

// get user details (personal data and address)
router.get("/user-details", auth, getUserInfo);

// update user details (personal data and address)
router.put("/user-details", validate("userData"), auth, putUserInfo);

module.exports = router;

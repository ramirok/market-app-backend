const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const {
  sendActivateAccount,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
} = require("../emails/account");
const expressValidator = require("express-validator");

const createUser = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });

  // if validator middleware has error, returns error message
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0] });

  const { name, email, password } = req.body;
  try {
    // checks if email already exist
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // signs token with credentials
    const token = jwt.sign(
      { name, email, password },
      config.VERIFY_ACC_SECRET,
      { expiresIn: "20m" }
    );

    // sends email with link to activation
    sendActivateAccount(email, token);

    return res.json({
      message: "We have sent you an email with the activation code.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const activateUser = async (req, res) => {
  const { token } = req.body;

  try {
    if (token) {
      try {
        // decodes token and creates new user with decoded credentials
        const decoded = jwt.verify(token, config.VERIFY_ACC_SECRET);
        const { name, email, password } = decoded;
        const user = new User({ name, email, password });
        await user.save();
      } catch (error) {
        // if toke verify fails, sends error message
        return res.status(400).json({ message: "Link has expired" });
      }
      res.json({ message: "Signed up seccesfully" });
    } else {
      // if no token is sent in the request, send error message
      return res.status(400).json({ message: "Link has expired" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const loginUser = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });

  // if validator middleware has error, returns error message
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0] });

  try {
    // find user by credentials
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    // if no user, returns error message
    if (!user) {
      return res.status(400).json({ message: "Wrong email or password." });
    }

    // if user found, generates token and returns user and token
    const token = await user.generateAuthToken();

    res.json({ user, token });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed, please try again." });
  }
};

const forgotPass = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });

  // if validator middleware has error, returns error message
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0] });

  const { email } = req.body;

  try {
    // find user by email
    const user = await User.findOne({ email });

    // if no user is found, return message anyways
    if (!user) {
      return res.json({
        message: "Email has been sent, follow the instrucions",
      });
    }

    // if user is found, sings a token and updates user's resetLink
    const token = jwt.sign({ _id: user._id }, config.RESET_PASS_SECRET, {
      expiresIn: "20m",
    });
    await user.updateOne({ resetLink: token });

    // sends reset password link email
    sendPasswordResetEmail(email, token);

    res.json({ message: "Email has been sent, follow the instrucions" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const ResetPass = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });

  // if validator middleware has error, returns error message
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0] });

  const { resetLink, passwordConfirmation } = req.body;

  try {
    if (resetLink) {
      try {
        // verifies resetLink and send error message if failed
        jwt.verify(resetLink, config.RESET_PASS_SECRET);
      } catch (error) {
        return res.status(400).json({ message: "Link has expired." });
      }

      // find user by resetLink
      const user = await User.findOne({ resetLink });
      if (!user) {
        // if no user is found, sends error message
        return res.status(400).json({ message: "Link has expired." });
      }

      // if user is found, updates password and resetLink, and saves updated user
      user.password = passwordConfirmation;
      user.resetLink = "";
      await user.save();

      res.json({ message: "Your password has been changed." });
    } else {
      // if no resetLink is sent in the request, sends error message
      return res.status(400).json({ message: "Link has expired." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const logoutUser = async (req, res) => {
  try {
    // removes the token sent in the request from the token list and saves the updated user
    req.user.tokens = req.user.tokens.filter((el) => el.token !== req.token);
    await req.user.save();
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const logoutUserFromAll = async (req, res) => {
  try {
    // removes all tokens exept the one sent in the request and saves the updated user
    req.user.tokens = req.user.tokens.filter((el) => el.token === req.token);
    await req.user.save();
    res.json({ message: "Closed all sessions on others devices." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const changePass = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });

  // if validator middleware has error, returns error message
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0] });

  const { currentPass, passwordConfirmation } = req.body;

  try {
    // compares currentPassword with password stored in db
    const isMatch = await bcrypt.compare(currentPass, req.user.password);

    if (!isMatch) {
      // if doesn't match, sends error message
      return res.status(400).json({ message: "Wrong password." });
    }

    // updates user with new pasword
    req.user.password = passwordConfirmation;

    await req.user.save();

    // sends password has changed email
    sendPasswordChangedEmail(req.user.email, req.user.name);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

module.exports = {
  createUser,
  activateUser,
  loginUser,
  forgotPass,
  ResetPass,
  logoutUser,
  logoutUserFromAll,
  changePass,
};
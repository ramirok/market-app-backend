const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");
const {
  sendWelcomeEmail,
  sendCancelationEmail,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendActivateAccount,
} = require("../emails/account");
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill all the fields." });
  }

  try {
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ error: "Email already exist." });
    }

    const token = jwt.sign(
      { name, email, password },
      config.VERIFY_ACC_SECRET,
      { expiresIn: "20m" }
    );

    sendActivateAccount(email, token);

    return res.json({
      message: "We have sent you an email with the activation code.",
    });
  } catch (error) {
    // if (error.name === "ValidationError") {
    //   for (field in error.errors) {
    //     return res
    //       .status(400)
    //       .json({ error: error.errors[field].properties.message });
    //   }
    // }

    res.status(400).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/users/activate", async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.VERIFY_ACC_SECRET);

      const { name, email, password } = decoded;

      const exist = await User.findOne({ email });

      if (exist) {
        return res.status(400).json({ error: "Email already exist." });
      }

      const user = new User({ name, email, password });

      await user.save();

      res.json({ message: "Signed up seccesfully" });
    } catch (error) {
      return res.status(400).json({ error: "Link has expired" });
    }
  } else {
    res.status(400).json({ error: "Something went wrong, please try again." });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/users/forgot-pass", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "Email has been sent, follow the instrucions",
      });
    }

    const token = jwt.sign({ _id: user._id }, config.RESET_PASS_SECRET, {
      expiresIn: "20m",
    });

    await user.updateOne({ resetLink: token });

    sendPasswordResetEmail(email, token);

    res.json({ message: "Email has been sent, follow the instrucions" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong, please try again." });
  }
});

router.put("/users/reset-pass", async (req, res) => {
  const { resetLink, newPass } = req.body;

  try {
    if (resetLink) {
      try {
        jwt.verify(resetLink, config.RESET_PASS_SECRET);
      } catch (error) {
        return res.status(400).json({ error: "Link has expired" });
      }

      const user = await User.findOne({ resetLink });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Something went wrong, please try again." });
      }

      user.password = newPass;
      user.resetLink = "";

      await user.save();

      res.json({ message: "Your password has been changed." });
    } else {
      return res.status(400).json({ error: "Authentication error." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => el.token !== req.token);
    await req.user.save();
    res.end();
  } catch (error) {
    res.status(500).end();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => el.token === req.token);
    await req.user.save();
    res.json({ message: "Closed all sessions on others devices." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
});

router.post("/users/change", auth, async (req, res) => {
  const currentPass = req.body.currentPass;
  const newPass = req.body.newPass;

  try {
    const isMatch = await bcrypt.compare(currentPass, req.user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong email or password." });
    }

    req.user.password = newPass;

    await req.user.save();

    // sendPasswordChangedEmail(req.user.email, req.user.name);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong, try again." });
  }
});

module.exports = router;

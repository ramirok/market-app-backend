const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  sendWelcomeEmail,
  sendCancelationEmail,
  sendPasswordChangedEmail,
} = require("../emails/account");
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    sendWelcomeEmail(user.email, user.name);

    res.status(201).json({ user });
  } catch (error) {
    if (error.name === "ValidationError") {
      for (field in error.errors) {
        return res
          .status(400)
          .json({ error: error.errors[field].properties.message });
      }
    }

    res.status(400).json({ error: "Something went wrong. Please try again." });
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

router.post("/users/reset", async (req, res) => {
  try {
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

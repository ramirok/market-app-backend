const router = require("express").Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

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

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => el.token !== req.token);
    await req.user.save();
    res.end();
  } catch (error) {
    res.status(500).end();
  }
});

module.exports = router;

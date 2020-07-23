const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../utils/config");

const auth = async (req, res, next) => {
  try {
    // extracts token from header
    const token = req.header("Authorization").replace("Bearer ", "");

    // verifies token a finds user from id in decoded data
    const decoded = jwt.verify(token, config.SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    // if no user is found, throws error
    if (!user) {
      throw new Error();
    }

    // if user is found, attach token and found user to request
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(400).send({ message: "Please authenticate." });
  }
};

module.exports = auth;

const User = require("../models/user");
const UserDetails = require("../models/userDetails");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Payment = require("../models/payment");
const UserHistory = require("../models/userHistory");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const google = require("../utils/google");
const { asyncForEach } = require("../utils/helpers");
const fetch = require("node-fetch");
const {
  sendActivateAccount,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
} = require("../emails/account");
const expressValidator = require("express-validator");
const mongoose = require("mongoose");
const paypal = require("../utils/paypal");

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
    if (exist)
      return res.status(400).json({ message: "Email already in use." });

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

        // sends email with welcome message
        sendWelcomeEmail(email, name);
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

    res.json({ token });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed, please try again." });
  }
};

const loginUserGoogle = async (req, res) => {
  if (req.query.code) {
    try {
      // gets acces token from code query in redirect url
      const tokens = await google.getAccessTokenFromCode(req.query.code);

      // gets user details from token
      const userDetails = await google.getUserDetails(tokens.access_token);

      // checks if user email already exist
      const exist = await User.findOne({ email: userDetails.email });

      if (!exist) {
        // if it doesn't exist, creates and saves new user
        const user = new User({
          name: userDetails.name,
          email: userDetails.email,
          password: userDetails.email + config.SECRET,
        });
        await user.save();

        // sends email with welcome message
        sendWelcomeEmail(userDetails.email, userDetails.name);

        // returns user info and token
        const token = await user.generateAuthToken();
        return res.json({ token });
      }
      // if user already exists, returns user info and token
      const token = await exist.generateAuthToken();
      return res.json({ user: exist, token });
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Failed, please try again." });
    }
  } else {
    try {
      // generates and send url for login with google
      const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${google.stringifiedParams}`;
      res.json({ url: googleLoginUrl });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed, please try again." });
    }
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

const resetPass = async (req, res) => {
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
    res.json({});
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

const getUserInfo = async (req, res) => {
  try {
    // finds user details by id
    let details = await UserDetails.findOne({ owner: req.user._id });

    //if user details have been never created, sends an empty object
    if (!details) {
      return res.json({});
    }

    // if is found, send details
    res.json(details);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const putUserInfo = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });

  // if validator middleware has error, returns error message
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0] });

  try {
    const reqData = req.body;

    // finds user details by id
    let details = await UserDetails.findOne({ owner: req.user._id });

    //if user details have been never created, creates new

    if (!details) {
      details = new UserDetails({ owner: req.user._id });
    }

    // add new inputs and save
    for (const key in reqData) {
      reqData[key] ? (details[key] = reqData[key]) : null;
    }
    await details.save();

    // always returns empty object
    res.json({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const createPurchaseOrder = async (req, res) => {
  try {
    const accessToken = await paypal.getAccessToken();

    const infoCompleted = await UserDetails.findOne({ owner: req.user._id });

    if (
      !infoCompleted ||
      !(infoCompleted.infoCompleted && infoCompleted.addressCompleted)
    ) {
      return res.status(400).json({ info: false });
    }

    // finds user's cart
    const cart = await Cart.findOne({ owner: req.user._id }).populate(
      "products.data"
    );

    let total = 0;
    const items = cart.products.map((item) => {
      // purchase total
      total += item.data.price * item.quantity;

      // return item data for creating order
      return {
        name: item.data.name,
        unit_amount: {
          value: item.data.price.toFixed(2),
          currency_code: "USD",
        },
        quantity: item.quantity,
        sku: item.data._id,
      };
    });

    // creates order
    const order = await fetch(
      "https://api.sandbox.paypal.com/v2/checkout/orders/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: "MarketApp purchase",
              amount: {
                value: total.toFixed(2), //purchase total
                currency_code: "USD",
                breakdown: {
                  item_total: { value: total.toFixed(2), currency_code: "USD" },
                },
              },
              items, //cart items
            },
          ],
        }),
      }
    );

    // if order creation fails, return 400
    if (order.statusText !== "Created") {
      console.log(order);
      return res.status(400).end();
    }

    const parsedOrder = await order.json();

    // return order id
    res.json({ orderID: parsedOrder.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const resetCart = async (req, res) => {
  const { orderId } = req.body;

  try {
    const accessToken = await paypal.getAccessToken();

    // fetches order details
    const details = await fetch(
      `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: `application/json`,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // if fetch fetch fails, send 400 status
    if (details.statusText !== "Created") {
      return res.status(400).end();
    }

    const parsedDetails = await details.json();

    // finds user's cart
    const cart = await Cart.findOne({ owner: req.user._id }).populate(
      "products.data"
    );

    // saves purchase history for each product in the cart
    let history = [];
    cart.products.forEach((item) => {
      history.push({
        data: item.data._id,
        quantity: item.quantity,
      });
    });

    // saves new payment in the db
    let transactionData = {};
    transactionData.owner = req.user._id;
    transactionData.products = history;
    transactionData.data = parsedDetails;

    const payment = new Payment(transactionData);
    await payment.save();

    // increase sold number in products database
    await asyncForEach(cart.products, async (item) => {
      await Product.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(item.data._id) },
        { $inc: { sold: item.quantity } }
      );
    });

    // empty user's cart
    cart.products = [];
    await cart.save();

    // return empty cart
    res.status(200).json([]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const orders = async (req, res) => {
  try {
    // finds user's orders
    const orders = await Payment.find({ owner: req.user._id }).populate(
      "products.data"
    );

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const postHistory = async (req, res) => {
  const errors = expressValidator
    .validationResult(req)
    .formatWith(({ msg }) => {
      return msg;
    });

  // if validator middleware has error, returns error message
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0] });

  // const { newId } = req.body; //item to add to history
  const { id } = req.params; //item to add to history

  try {
    // finds user's history
    let history = await UserHistory.findOne({ owner: req.user._id });

    // if not found, creates new hsitory and returns
    if (!history) {
      const history = new UserHistory({
        products: [id],
        owner: req.user._id,
      });
      await history.save();
      return res.end();
    }

    // filter new item from history in case it already exist, and adds it to the top
    const newArray = history.products
      .filter((item) => item.toString() !== id)
      .slice(0, 7);
    newArray.unshift(id);
    history.products = newArray;
    await history.save();

    res.json({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed, please try again." });
  }
};

const getHistory = async (req, res) => {
  try {
    // finds user's history
    const history = await UserHistory.findOne({ owner: req.user._id }).populate(
      "products"
    );

    if (!history) {
      return res.json([]);
    }
    res.json(history.products);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

module.exports = {
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
};

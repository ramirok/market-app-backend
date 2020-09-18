const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cartRouters = require("./routers/cart.router");
const productsRouters = require("./routers/products.router");
const usersRouters = require("./routers/user.router");
require("./db/mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/products", productsRouters);
app.use("/users", usersRouters);
app.use("/cart", cartRouters);

module.exports = app;

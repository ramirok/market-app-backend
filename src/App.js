const express = require("express");
const cors = require("cors");
const adminRouter = require("./routers/admin");
const productRouter = require("./routers/products");
const userRouter = require("./routers/user");
const cartRouter = require("./routers/cart");
require("./db/mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(productRouter);
app.use(adminRouter);
app.use(userRouter);
app.use(cartRouter);

module.exports = app;

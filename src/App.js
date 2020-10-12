const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cartRouters = require("./routers/cart.router");
const productsRouters = require("./routers/products.router");
const usersRouters = require("./routers/user.router");
require("./db/mongoose");

const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// app.use(express.static("build"));
app.use(
  express.static("build", {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      const hashRegExp = new RegExp("\\.[0-9a-f]{8}\\.");
      if (path.endsWith(".html") || path.endsWith(".webp")) {
        res.setHeader("Cache-Control", "no-cache");
      } else if (hashRegExp.test(path)) {
        res.setHeader("Cache-Control", "max-age=31536000");
      }
    },
  })
);

app.use("/products", productsRouters);
app.use("/users", usersRouters);
app.use("/cart", cartRouters);

/* catch-all route to index.html */
app.get("/*", (req, res) => {
  res.sendFile(path.resolve("build/index.html"));
});

module.exports = app;

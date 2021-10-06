const express = require("express");
const cors = require("cors");
const cartRouters = require("./routers/cart.router");
const productsRouters = require("./routers/products.router");
const usersRouters = require("./routers/user.router");
require("./db/mongoose");

const path = require("path");
const { generalError } = require("./utils/errors");

const app = express();

app.use(cors());
app.use(express.json());

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

app.use((error, req, res, next) => {
  console.log(error);
  if (error instanceof generalError) {
    return res.status(error.getCode()).json({ message: error.message });
  }

  res.status(500).json({ message: "Failed, please try again." });
});

/* catch-all route to index.html */
app.get("/*", (req, res) => {
  res.sendFile(path.resolve("build/index.html"));
});

module.exports = app;

require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URL =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URL_TEST
    : process.env.MONGODB_URL;

const SECRET = process.env.SECRET;

module.exports = { PORT, MONGODB_URL, SECRET };

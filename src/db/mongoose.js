const mongoose = require("mongoose");
const config = require("../utils/config");

mongoose.connect(config.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

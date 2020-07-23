const mongoose = require("mongoose");
const config = require("../utils/config"); //gets url from config file

mongoose.connect(config.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

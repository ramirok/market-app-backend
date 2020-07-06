const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../utils/config");

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
      trim: true,
      minlength: [4, "Name must be 4 characters minimun."],
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: [4, "Password must be 4 characters minimun. "],
      trim: true,
    },
    tokens: [{ token: { type: String, require: true } }],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject.password;
    delete returnedObject.tokens;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

userSchema.methods.generateAuthToken = async function () {
  const token = await jwt.sign({ _id: this._id.toString() }, config.SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Wrong email or password.");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong email or password.");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

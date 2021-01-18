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
    resetLink: { data: String, default: "" },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.password;
    delete returnedObject.tokens;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
    delete returnedObject.resetLink;
  },
});

// custom method for generate and add token to tokens array
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString(), email: this.email, name: this.name },
    config.SECRET
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// custom static method for finding by credentials
userSchema.statics.findByCredentials = async (email, password, res) => {
  // finds by email
  try {
    const user = await User.findOne({ email });

    // if no user found, throws error
    if (!user) {
      throw new Error();
    }
    // compare provided password in request with password in db
    const isMatch = await bcrypt.compare(password, user.password);

    // if passwords doesn't match, throws error
    if (!isMatch) {
      throw new Error();
    }

    return user;
  } catch (error) {
    return null;
  }
};

// hash password before save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

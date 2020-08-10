const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  infoCompleted: { type: Boolean, default: false },
  addressCompleted: { type: Boolean, default: false },
  fullName: String,
  phoneNumber: Number,
  state: String,
  city: String,
  zipCode: Number,
  street: String,
  streetNumber: Number,

  owner: { type: mongoose.Types.ObjectId, required: true },
});

userDetailsSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.info = {
      fullName: returnedObject.fullName,
      phoneNumber: returnedObject.phoneNumber,
    };
    returnedObject.address = {
      state: returnedObject.state,
      city: returnedObject.city,
      zipCode: returnedObject.zipCode,
      street: returnedObject.street,
      streetNumber: returnedObject.streetNumber,
    };

    // deletes all keys except info={}, address={}, infoCompleted and addressCompleted
    for (const key in returnedObject) {
      if (
        !(
          key === "info" ||
          key === "address" ||
          key === "infoCompleted" ||
          key === "addressCompleted"
        )
      ) {
        delete returnedObject[key];
      }
    }
  },
});

// if all fields in user info are completed, sets infoCompleted and addressCompleted
userDetailsSchema.pre("save", async function (next) {
  if (!this.infoCompleted) {
    if (!this.$isEmpty("fullName") && !this.$isEmpty("phoneNumber"))
      this.infoCompleted = true;
  }

  if (!this.addressCompleted) {
    if (
      !this.$isEmpty("state") &&
      !this.$isEmpty("city") &&
      !this.$isEmpty("zipCode") &&
      !this.$isEmpty("street") &&
      !this.$isEmpty("streetNumber")
    )
      this.addressCompleted = true;
  }
  next();
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = UserDetails;

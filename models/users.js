const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  console.log("In findUserByCrdentials");
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log("User found:", !!user);
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      console.log("Before");
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        console.log("after the password comparison:", user);
        return user; // now user is available
      });
    });
};

module.exports = mongoose.model("user", userSchema);

const mongoose = require("mongoose");
const validator = require("validator");

const clothingSchema = new mongoose.Schema({
  name: {
    // every user has a name field, the requirements for which are described below:
    type: String, // the name type is a string
    required: true, // every user has a name, so it's a required field
    minlength: 2, // the minimum length of the name is 2 characters
    maxlength: 30, // the maximum length is 30 characters
  },
  weather: {
    type: String, // the pronouns are a string
    required: true,
    enum: ["hot", "warm", "cold"], // every user can choose their pronouns
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothing", clothingSchema);

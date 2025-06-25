const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { errorCodes } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports.signup = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log(name, avatar, email, password);
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash, // adding the hash to the database
      })
    )

    .then((user) => {
      // Convert the user document to a plain object and remove the password field
      const userData = user.toObject();
      delete userData.password;

      res.status(201).send({ data: userData }); // Send response without password
    })

    .catch((err) => {
      console.log("CATCH BLOCK REACHED");
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      }
      if (err.code === 11000) {
        return res
          .status(errorCodes.CONFLICT_ERROR.number)
          .send({ message: errorCodes.CONFLICT_ERROR.message });
      }
      return res
        .status(errorCodes.INTERNAL_SERVER_ERROR.number)
        .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
    });
};

// the getUser request handler
module.exports.getCurrentUser = (req, res) => {
  console.log("at getCurrentUser");
  if (!req.user || !req.user._id) {
    return res
      .status(errorCodes.UNAUTHORIZED.number)
      .send({ message: errorCodes.UNAUTHORIZED.message });
  }
  return User.findById(req.user._id)
    .orFail() // No need to pass a custom error, Mongoose handles this
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        // Invalid ID format (not a valid ObjectId)
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      }

      if (err.name === "DocumentNotFoundError") {
        // Document wasn't found (valid ID format but no matching user)
        return res
          .status(errorCodes.NOT_FOUND.number)
          .send({ message: errorCodes.NOT_FOUND.message });
      }

      // Any other error is treated as a server error
      return res
        .status(errorCodes.INTERNAL_SERVER_ERROR.number)
        .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(errorCodes.BAD_REQUEST.number)
      .send({ message: errorCodes.BAD_REQUEST.message });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      // we're creating a token
      console.log("User found:", !!user);

      // JWT_SECRET contains a value of your secret key for the
      // signature. Declare it in a separate file, such as utils/config.js.

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Password valid:", token);
      // successful authentication, send a token
      res.status(200).send({ message: "Everything good!", token, user });
    })
    .catch((err) => {
      console.log("At catch");
      console.error(err);
      if (err.message === "Incorrect email or password") {
        console.error(err);
        // Invalid ID format (not a valid ObjectId)
        return res
          .status(errorCodes.UNAUTHORIZED.number)
          .send({ message: errorCodes.UNAUTHORIZED.message });
      }

      if (err.name === "CastError") {
        // Invalid ID format (not a valid ObjectId)
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      }

      if (err.name === "DocumentNotFoundError") {
        // Document wasn't found (valid ID format but no matching user)
        return res
          .status(errorCodes.NOT_FOUND.number)
          .send({ message: errorCodes.NOT_FOUND.message });
      }

      // Any other error is treated as a server error
      return res
        .status(errorCodes.INTERNAL_SERVER_ERROR.number)
        .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
    });
};

module.exports.updateProfile = (req, res) => {
  // Recall that you’ve already set up your user model to validate that the
  // data used meets certain criteria. However,
  // by default, this validation won’t be run when updating a resource.
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, avatar } },
    { new: true, runValidators: true } // Return the updated document // validation will be run when updating a resource
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      }
      if (err.name === "CastError") {
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorCodes.NOT_FOUND.number)
          .send({ message: errorCodes.NOT_FOUND.message });
      }
      return res
        .status(errorCodes.INTERNAL_SERVER_ERROR.number)
        .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
    });
};

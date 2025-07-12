const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { errorCodes } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

// const generateToken = (user) => {
//   const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//     expiresIn: "7d",
//   });
//   console.log("Password valid:", token);
//   return token;

// };

module.exports.signup = (req, res, next) => {
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
      // const token = generateToken(user);
      // Convert the user document to a plain object and remove the password field
      const userData = user.toObject();
      delete userData.password;
      console.log("at signup, user:", userData);

      res.status(201).send({ user: userData }); // Send response without password
    })

    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("A user with the email already exists"));
      }
      if (err.name === "ValidationError") {
        // Invalid ID format (not a valid ObjectId)
        next(
          new BadRequestError("Invalid data passed to the methods for signup.")
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
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
        next(new UnauthorizedError("The user email or password is incorrect."));
      }

      if (err.name === "CastError") {
        next(
          new BadRequestError("The email or password is in an invalid format")
        );
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The user is not found."));
      } else {
        next(err);
      }
    });
};

// the getUser request handler
module.exports.getCurrentUser = (req, res, next) => {
  console.log("at getCurrentUser");
  if (!req.user || !req.user._id) {
    throw new UnauthorizedError("You are not authorized. Please sign in.");
  }
  return User.findById(req.user._id)
    .orFail() // No need to pass a custom error, Mongoose handles this
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        // Invalid ID format (not a valid ObjectId)
        next(
          new BadRequestError(
            "Invalid data passed to the methods for getting current user."
          )
        );
      }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError(
            "There is no user with the requested ID, or the request was sent to a non-existent address."
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
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
        next(
          new BadRequestError(
            "Invalid data passed to the methods for updating profile."
          )
        );
      }
      if (err.name === "CastError") {
        next(new BadRequestError("The name or avatar is in an invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("The user is not found to upate name and password.")
        );
      } else {
        next(err);
      }
    });
};

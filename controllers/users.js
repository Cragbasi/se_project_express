const User = require("../models/users");
const { errorCodes } = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      }
      return res
        .status(errorCodes.INTERNAL_SERVER_ERROR.number)
        .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
    });
};

// the getUser request handler
module.exports.getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .orFail() // No need to pass a custom error, Mongoose handles this
    .then((user) => res.send({ data: user }))
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

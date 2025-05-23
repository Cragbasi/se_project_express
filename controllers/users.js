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
    .catch(() => {
      console.error(err);

      if (err.name === errorCodes.BAD_REQUEST.number) {
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      } else if (err.name === errorCodes.NOT_FOUND.number) {
        return res
          .status(errorCodes.NOT_FOUND.number)
          .send({ message: errorCodes.NOT_FOUND.message });
      } else {
        // if no errors match, return a response with status code 500
        return res
          .status(errorCodes.INTERNAL_SERVER_ERROR.number)
          .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
      }
    });
};

// the getUser request handler
module.exports.getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = 404;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

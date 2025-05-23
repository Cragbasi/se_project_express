const Item = require("../models/clothingItems");
const { errorCodes } = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, link } = req.body;
  console.log(req.user._id);

  Item.create({ name, weather, link, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);

      if (err.name === errorCodes.BAD_REQUEST.number) {
        return res
          .status(errorCodes.BAD_REQUEST.number)
          .send({ message: errorCodes.BAD_REQUEST.message });
      }
      if (err.name === errorCodes.NOT_FOUND.number) {
        return res
          .status(errorCodes.NOT_FOUND.number)
          .send({ message: errorCodes.NOT_FOUND.message });
      }
      // if no errors match, return a response with status code 500
      return res
        .status(errorCodes.INTERNAL_SERVER_ERROR.number)
        .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
    });
};

// the getUser request handler
module.exports.deleteItemByID = (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

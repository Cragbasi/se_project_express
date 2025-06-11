const Item = require("../models/clothingItems");
const { errorCodes } = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(errorCodes.INTERNAL_SERVER_ERROR.number)
        .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log("at createItem");

  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
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

module.exports.deleteItemByID = (req, res) => {
  const { itemId } = req.params;

  // check whether the item owner's _id equals the _id of the logged-in user.
  // If the _id of the current user and the item's owner is the same, the item can be deleted.
  // This is done with the auth.js

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        return Item.findByIdAndDelete(itemId).then(() => {
          res.status(200).send({ message: "Item deleted" });
        });
      }
      return res
        .status(403)
        .send({ message: "You don't have permission to delete this item" });
    })
    .catch((err) => {
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

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
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

module.exports.dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
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

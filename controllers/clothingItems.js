const Item = require("../models/clothingItems");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports.getItems = (req, res, next) => {
  console.log("at eports.getItems, req:", req);
  if (!req.user || !req.user._id) {
    throw new UnauthorizedError("Unauthorized: user not found");
  }

  const userId = req.user._id; // assuming authentication middleware sets req.user

  Item.find({ owner: userId })
    .then((items) => res.status(200).send(items))
    .catch(next); // Let centralized error handler deal with it
};

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  console.log("at createItem");

  Item.create({ name, weather, imageUrl, owner: req.user._id, next })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Invalid data passed to the methods for creating an item."
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteItemByID = (req, res, next) => {
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
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("You can only delete your own items");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError(
            "There is no clothing item with the requested ID, or the request was sent to a non-existent address."
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Invalid data. Can not apply like to the the item"
          )
        );
      }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError(
            "The like request was sent to a non-existent address."
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Invalid data. Can not apply like to the the item"
          )
        );
      }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError(
            "The like request was sent to a non-existent address."
          )
        );
      } else {
        next(err);
      }
    });
};

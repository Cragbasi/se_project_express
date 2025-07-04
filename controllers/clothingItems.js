const Item = require("../models/clothingItems");
const { errorCodes } = require("../utils/errors");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch(next); // Let middleware handle database errors!
};

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  console.log("at createItem");

  Item.create({ name, weather, imageUrl, owner: req.user._id, next })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        // return res
        //   .status(errorCodes.BAD_REQUEST.number)
        //   .send({ message: errorCodes.BAD_REQUEST.message });
        next(
          new BadRequestError(
            "Invalid data passed to the methods for creating an item."
          )
        );
      } else {
        next(err);
      }
      // return res
      //   .status(errorCodes.INTERNAL_SERVER_ERROR.number)
      //   .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
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
      return res
        .status(errorCodes.DELETE_UNAUTHORIZED.number)
        .send({ message: errorCodes.DELETE_UNAUTHORIZED.message });
    })
    .catch((err) => {
      // if (err.name === "CastError") {
      //   return res
      //     .status(errorCodes.BAD_REQUEST.number)
      //     .send({ message: errorCodes.BAD_REQUEST.message });
      // }
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      }
      // if (err.name === "DocumentNotFoundError") {
      //   return res
      //     .status(errorCodes.NOT_FOUND.number)
      //     .send({ message: errorCodes.NOT_FOUND.message });
      // }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError(
            "There is no clothing item with the requested ID, or the request was sent to a non-existent address."
          )
        );
      } else {
        next(err);
      }
      // return res
      //   .status(errorCodes.INTERNAL_SERVER_ERROR.number)
      //   .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
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
      // if (err.name === "CastError") {
      //   return res
      //     .status(errorCodes.BAD_REQUEST.number)
      //     .send({ message: errorCodes.BAD_REQUEST.message });
      // }
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Invalid data. Can not apply like to the the item"
          )
        );
      }
      // if (err.name === "DocumentNotFoundError") {
      //   return res
      //     .status(errorCodes.NOT_FOUND.number)
      //     .send({ message: errorCodes.NOT_FOUND.message });
      // }
      // return res
      //   .status(errorCodes.INTERNAL_SERVER_ERROR.number)
      //   .send({ message: errorCodes.INTERNAL_SERVER_ERROR.message });
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

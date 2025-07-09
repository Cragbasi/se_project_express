const clothingItemRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateClothingItemId,
} = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItemByID,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

clothingItemRouter.get("/", auth, getItems);

clothingItemRouter.delete(
  "/:itemId",
  validateClothingItemId,
  auth,
  deleteItemByID
);

clothingItemRouter.post("/", validateClothingItem, auth, createItem);

clothingItemRouter.put(
  "/:itemId/likes",
  validateClothingItemId,
  auth,
  likeItem
);
clothingItemRouter.delete(
  "/:itemId/likes",
  validateClothingItemId,
  auth,
  dislikeItem
);

module.exports = clothingItemRouter;

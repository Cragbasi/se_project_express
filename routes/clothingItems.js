const clothingItemRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItemByID,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

clothingItemRouter.get("/", auth, getItems);

clothingItemRouter.delete("/:itemId", auth, deleteItemByID);

clothingItemRouter.post("/", auth, createItem);

clothingItemRouter.put("/:itemId/likes", auth, likeItem);
clothingItemRouter.delete("/:itemId/likes", auth, dislikeItem);

module.exports = clothingItemRouter;

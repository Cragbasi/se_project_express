const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItemByID,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.delete("/:itemId", deleteItemByID);

router.post("/", createItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;

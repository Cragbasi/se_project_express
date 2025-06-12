const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/items", clothingItemRouter);
router.use("/", userRouter);
// router.post("/users", userRouter);

module.exports = router;

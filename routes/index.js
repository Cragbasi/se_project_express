const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

const {
  login,
  signup,
  createUser,
  getCurrentUser,
  updateProfile,
  getUsers,
  getUserByID,
} = require("../controllers/users");

router.use("/items", clothingItemRouter);
router.use("/", userRouter);
// router.post("/users", userRouter);

module.exports = router;

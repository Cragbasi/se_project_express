const userRouter = require("express").Router();
const auth = require("../middlewares/auth");
// const { getUsers, createUser, getUserByID } = require("../controllers/users");

const {
  login,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

userRouter.get("/", getUsers);
userRouter.get("/:userId", getUserByID);
userRouter.post("/", createUser);

userRouter.get("/users/me", auth, getCurrentUser);
userRouter.post("/signin", login);
userRouter.post("/signup", createUser);
userRouter.patch("/users/me", auth, updateProfile);

module.exports = userRouter;

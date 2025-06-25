const userRouter = require("express").Router();
const auth = require("../middlewares/auth");

const {
  login,
  signup,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

userRouter.get("/users/me", auth, getCurrentUser);
userRouter.post("/signin", login);
userRouter.post("/signup", signup);
userRouter.patch("/users/me", auth, updateProfile);

module.exports = userRouter;

const userRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateAuthentication,
  validateUserId,
} = require("../middlewares/validation");

const {
  login,
  signup,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

userRouter.get("/users/me", validateUserId, auth, getCurrentUser);

userRouter.post("/signin", validateAuthentication, login);
userRouter.post("/signup", validateUserBody, signup);
userRouter.patch("/users/me", validateUserId, auth, updateProfile);

module.exports = userRouter;

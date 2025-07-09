const userRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateAuthentication,
  validateUserId,
  validateUserProfileUpdate,
} = require("../middlewares/validation");

const {
  login,
  signup,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

userRouter.get("/users/me", auth, getCurrentUser);
userRouter.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
userRouter.post("/signin", validateAuthentication, login);
userRouter.post("/signup", validateUserBody, signup);
userRouter.patch("/users/me", auth, validateUserProfileUpdate, updateProfile);

module.exports = userRouter;

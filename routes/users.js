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

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
userRouter.post("/signin", validateAuthentication, login);
userRouter.post("/signup", validateUserBody, signup);
userRouter.patch("/users/me", validateUserId, auth, updateProfile);

module.exports = userRouter;

const router = require("express").Router();
const { users } = require("./db");

const doesUserExist = (req, res, next) => {
  if (res.staus === 404) {
    res.send({
      message: "Requested resource not found",
    });
    return;
  }

  next(); // call the next function
};

router.use("/users/:id", doesUserExist);

const router = require("express").Router();
const { getUsers, createUser, getUserByID } = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUserByID);

router.post("/", createUser);

module.exports = router;

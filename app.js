const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const { PORT = 3001 } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "682e15ad8764862e66ca4530", // paste the _id of the test user created in the previous step
  };
  next();
});
app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

const handleNonExistentRoute = (req, res, next) => {
  res.status(404);
  res.send({
    message: "Requested resource not found",
  });
};

app.use(handleNonExistentRoute);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

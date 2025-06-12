const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const cors = require("cors");

const app = express();

const { PORT = 3006 } = process.env; //port 3006

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// // Authorization hard coded. Remove the hard-coded user object
// app.use((req, res, next) => {
//   req.user = {
//     _id: "682e15ad8764862e66ca4530", // paste the _id of the test user created in the previous step
//   };
//   next();
// });
app.use("/", routes);

const handleNonExistentRoute = (req, res) => {
  res.status(404);
  res.send({
    message: "Requested resource not found",
  });
};

app.use(handleNonExistentRoute);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

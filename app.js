const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { errors } = require("celebrate");
const routes = require("./routes/index");
const auth = require("./middlewares/auth");
const { errorCodes } = require("./utils/errors");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/NotFoundError");

const app = express();

const { PORT = 3001 } = process.env; // port 3006

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", routes);

const handleNonExistentRoute = (req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
};

app.use("/", handleNonExistentRoute);

app.use(errorLogger); // enabling the error logger

// celebrate error handler
app.use(errors());

// ERROR HANDLER MUST BE LAST!
app.use(errorHandler);

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

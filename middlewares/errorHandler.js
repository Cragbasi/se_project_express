// middleware/errorHandler.js
const { errorCodes } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err.stack);

  // Default error response
  let statusCode = errorCodes.INTERNAL_SERVER_ERROR.number;
  let message = errorCodes.INTERNAL_SERVER_ERROR.message;

  // Handle different types of errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid data provided";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate data - this item already exists";
  } else if (err.statusCode) {
    // If error already has a status code, use it
    statusCode = err.statusCode;
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

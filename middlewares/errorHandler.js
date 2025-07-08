// middleware/errorHandler.js
const { errorCodes } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err.stack);

  // Default error response
  let statusCode = errorCodes.INTERNAL_SERVER_ERROR.number;
  let message = errorCodes.INTERNAL_SERVER_ERROR.message;

  // Handle different types of errors
  if (err.statusCode) {
    // If error already has a status code, use it
    statusCode = err.statusCode;
    message = err.message;
  }

  const errorResponse = {
    message: statusCode === 500 ? "An error occurred on the server" : message,
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

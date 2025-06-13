module.exports.errorCodes = {
  BAD_REQUEST: {
    number: 400,
    message:
      "Invalid data passed to the methods for creating an item/user or updating an item, or invalid ID passed to the params.",
  },
  UNAUTHORIZED: {
    number: 401,
    message: "User not authenticated",
  },
  NOT_FOUND: {
    number: 404,
    message:
      "There is no user or clothing item with the requested ID, or the request was sent to a non-existent address.",
  },
  DELETE_UNAUTHORIZED: {
    number: 403,
    message: "You don't have permission to delete this item",
  },
  INTERNAL_SERVER_ERROR: {
    number: 500,
    message: "An error has occurred on the server.",
  },
  CONFLICT_ERROR: {
    number: 409,
    message: "conflict error",
  },
};

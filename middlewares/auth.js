const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ForbiddenError = require("../errors/ForbiddenError");

// The authentication middleware
module.exports = (req, res, next) => {
  console.log("At middleware");
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new ForbiddenError("You are not authorized. Please log in.");
  }

  const token = authorization.replace("Bearer ", "");
  console.log("token:", token);
  let payload;

  try {
    console.log("at try");
    payload = jwt.verify(token, JWT_SECRET);
    console.log("JWT_SECRET:", JWT_SECRET);
    console.log("payload:", payload);
  } catch (err) {
    throw new ForbiddenError("You are not authorized. Please log in.");
  }

  req.user = payload; // assigning the payload to the request object
  console.log("req.user:", req.user);
  console.log("Auth header:", req.headers.authorization);

  return next(); // sending the request to the next middleware
};

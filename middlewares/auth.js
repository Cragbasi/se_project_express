const jwt = require("jsonwebtoken");
const { errorCodes } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// The authentication middleware
module.exports = (req, res, next) => {
  console.log("At middleware");
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(errorCodes.UNAUTHORIZED.number)
      .send({ message: errorCodes.UNAUTHORIZED.message });
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
    return res
      .status(errorCodes.UNAUTHORIZED.number)
      .send({ message: errorCodes.UNAUTHORIZED.message });
  }

  req.user = payload; // assigning the payload to the request object
  console.log("req.user:", req.user);
  return next(); // sending the request to the next middleware
};

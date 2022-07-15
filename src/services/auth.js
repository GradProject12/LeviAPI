const jwt = require("jsonwebtoken");
const { errorRes } = require("./response");

const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SERCRET);
    req.userId = decoded.userId;
    req.full_name = decoded.name;
    next();
  } catch (error) {
    res.status(401).json(errorRes(401, "Access denied, invalid token"));
    return;
  }
};

module.exports = verifyAuthToken;

const jwt = require("jsonwebtoken");

const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SERCRET);
    next();
  } catch (error) {
    res.status(401);
    res.json("Access denied, invalid token");
    return;
  }
};

module.exports = verifyAuthToken;

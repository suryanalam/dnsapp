// This middleware is used to authenticate whether the user is logged in or not

const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizeLogin = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(500).send({
      message: "token not found !!",
    });
  }

  try {
    let tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!tokenData) {
      return res.status(500).send({
        message: "Invalid Token !!",
      });
    }

    req.user = tokenData;
    next();
  } catch (err) {
    console.log("Error while verifying the token => ", err);
    return res.status(500).send({
      message: "Token verification failed !!",
    });
  }
};

module.exports = authorizeLogin;

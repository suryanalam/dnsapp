const express = require("express");
const { signup, login } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/login", login); // login User
authRouter.post("/signup", signup); // signup User

module.exports = authRouter;

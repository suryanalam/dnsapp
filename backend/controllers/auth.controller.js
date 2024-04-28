const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = mongoose.model("User");

const signup = async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(500).send({
      message: "Please enter the required user details !!",
    });
  }

  let isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return res.status(500).send({
      message: "User already exist !!",
    });
  }

  password = await bcrypt.hash(password, 10);
  if (!password) {
    return res.status(500).send({
      message: "Password not encrypted!!",
    });
  }

  let newUser = { name, email, password };

  let user = new User(newUser);
  let userData = await user.save();

  if (!userData) {
    return res.status(500).send({
      message: "Error while adding a user !!",
    });
  }

  const token = jwt.sign(
    {
      id: userData._id,
      name: userData.name,
      email: userData.email,
    },
    process.env.JWT_SECRET_KEY
  );

  if (!token) {
    return res.status(500).send({
      message: "User created but token not generated !!",
    });
  }

  res.status(200).send({
    message: "User created and logged In successfully !!",
    token: token,
  });
};

const login= async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.send("please enter the required user details !!");
  }

  const userData = await User.findOne({ email });

  if (!userData) {
    return res.status(401).send({
      message: "Invalid Email or Password !!",
    });
  }

  const isValid = await bcrypt.compare(password, userData.password);

  if (!isValid) {
    return res.status(401).send({
      message: "Invalid Email or Password !!",
    });
  }

  const token = jwt.sign(
    {
      id: userData._id,
      name: userData.name,
      email: userData.email,
    },
    process.env.JWT_SECRET_KEY
  );

  if (!token) {
    return res.status(500).send({
      message: "Token not generated !!",
    });
  }

  res.status(200).send({
    message: "User logged in successfully !!",
    token: token,
  });
};

module.exports = {
  login,
  signup,
};

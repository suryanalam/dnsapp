const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/User"); //User Model
require("./models/Record"); //Record Model

const authRouter = require("./routes/authRouter"); // Auth Router
const recordRouter = require("./routes/recordRouter"); // Record Router
const app = express(); // Express Server Instance

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connected..."))
  .catch((err) => {
    console.log("error while connecting db", err);
    process.exit(1);
  });

app.get("/", function (req, res) {
  res.send("welcome to dnsapp sever");
});

app.use(authRouter); //Authentication Router
app.use('/records',recordRouter); //DNS Records Router

app.listen(process.env.PORT, () => {
  console.log("server started at port", process.env.PORT);
});

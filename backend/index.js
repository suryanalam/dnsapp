const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Server Instance
const app = express(); 

//Models
require("./models/User"); //User Model
require("./models/Record"); //Record Model

//Routers
const authRouter = require("./routes/authRouter");
const recordRouter = require("./routes/recordRouter");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000','https://dnsapp.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected..."))
  .catch((err) => {
    console.log("error while connecting db", err);
    process.exit(1);
  });

app.get("/", function (req, res) {
  res.send("welcome to dnsapp api");
});

app.get('/api/getBaseUrl',(req,res)=>{
  res.send({
    baseUrl: "https://dnsapp-iulk.onrender.com"
  })
})

app.use(authRouter); //Authentication Router
app.use('/records',recordRouter); //DNS Records Router

app.listen(process.env.PORT, () => {
  console.log("server started at port", process.env.PORT);
});

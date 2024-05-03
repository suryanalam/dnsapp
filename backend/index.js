const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Server Instance
const app = express();

//Models
require("./models/User"); //User Model
const Record = require("./models/Record"); //Record Model
const HostedZone = require("./models/HostedZone"); //Hosted Zone Model

//Routers
const authRouter = require("./routes/authRouter");
const recordRouter = require("./routes/recordRouter");
const hostedZoneRouter = require("./routes/hostedZoneRouter");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://dnsapp.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected..."))
  .catch((err) => {
    console.log("Error while connecting to database", err);
    process.exit(1);
  });

app.get("/", function (req, res) {
  res.send("welcome to dnsapp api");
});

app.get('/get_collections_count', async (req,res)=>{
  let recordsCount = await Record.countDocuments();
  let hostedZonesCount = await HostedZone.countDocuments();

  if(!recordsCount || !hostedZonesCount){
    return res.status(500).send({
      message: "Error while counting documents in collection !!"
    })
  }

  res.status(200).send({
    message: "Collections count fetched successfully !!",
    data: {
      recordsCount,
      hostedZonesCount
    }
  });
})

app.use(authRouter); //Authentication Router
app.use("/records", recordRouter); //DNS Records Router
app.use("/hosted_zones", hostedZoneRouter); //Hosted Zones Router

app.listen(process.env.PORT, () => {
  console.log("server started at port", process.env.PORT);
});

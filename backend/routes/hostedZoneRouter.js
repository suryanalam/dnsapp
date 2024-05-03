const express = require("express");
const authorizeLogin = require("../middlewares/authorizeLogin");
const {
  addHostedZone,
  getAllHostedZone,
  getHostedZone,
  updateHostedZone,
  deleteHostedZone,
} = require("../controllers/hostedZone.controller");

const hostedZoneRouter = express.Router();

hostedZoneRouter.post("/", authorizeLogin, addHostedZone); // add Record
hostedZoneRouter.get("/", authorizeLogin, getAllHostedZone); // get all Records
hostedZoneRouter.get("/:id", authorizeLogin, getHostedZone); // get Record by id
hostedZoneRouter.put("/:id", authorizeLogin, updateHostedZone); // update Record by id
hostedZoneRouter.delete("/:id", authorizeLogin, deleteHostedZone); // delete Record by id

module.exports = hostedZoneRouter;

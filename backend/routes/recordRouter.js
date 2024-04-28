const express = require("express");
const authorizeLogin = require("../middlewares/authorizeLogin");
const {
  addRecord,
  getAllRecord,
  getRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/record.controller");

const recordRouter = express.Router();

recordRouter.post("/", authorizeLogin, addRecord); // add Record
recordRouter.get("/", authorizeLogin, getAllRecord); // get all Records
recordRouter.get("/:id", authorizeLogin, getRecord); // get Record by id
recordRouter.put("/:id", authorizeLogin, updateRecord); // update Record by id
recordRouter.delete("/:id", authorizeLogin, deleteRecord); // delete Record by id

module.exports = recordRouter;

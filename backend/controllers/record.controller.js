const {
  Route53Client,
  ListResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommand,
} = require("@aws-sdk/client-route-53");
let mongoose = require("mongoose");
require('dotenv').config()

const HostedZoneId = process.env.AWS_HOSTED_ZONE_ID;
const config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECREY_KEY,
  },
};

const client = new Route53Client(config);
const Record = mongoose.model("Record");

const addRecord = async (req, res) => {
  let { id } = req.user;
  let { name, value, type } = req.body;

  if (!id || !name || !value || !type) {
    return res.status(500).send({
      message: "please enter all the required fields !!",
    });
  }

  let newRecord = { uid: id, name, value, type };

  let record = new Record(newRecord);
  let recordData = await record.save();

  if (recordData) {
    return res.status(200).send({
      message: "Record created successfully !!",
      data: recordData,
    });
  } else {
    return res.status(500).send({
      message: "Error while adding a Record !!",
    });
  }
};

const getAllRecord = async (req, res) => {

  const input = {
    HostedZoneId: HostedZoneId,
  };

  const command = new ListResourceRecordSetsCommand(input);
  const response = await client.send(command);
  let records = response.ResourceRecordSets;

  if(records){
    return res.status(200).send({
      message: "Records found successfully !!",
      data: records,
    });
  }else{
    return res.status(500).send({
      message: "Error while fetching records !!",
    });
  }



  // let { id } = req.user;

  // let recordData = await Record.find({ uid: id });

  // if (recordData) {
  //   return res.status(200).send({
  //     message: "Records found successfully !!",
  //     data: recordData,
  //   });
  // } else {
  //   return res.status(500).send({
  //     message: "Error while fetching records !!",
  //   });
  // }
};

const getRecord = async (req, res) => {
  let id = req.params.id;

  let recordData = await Record.findOne({ _id: id });

  if (recordData) {
    return res.status(200).send({
      message: "Record found successfully !!",
      data: recordData,
    });
  } else {
    return res.status(404).send({
      message: "Record not found !!",
    });
  }
};

const updateRecord = async (req, res) => {
  let id = req.params.id;
  let { name, value, type } = req.body;

  if ((!name || !value || !type)) {
    return res.status(500).send({
      message: "please enter all the required fields !!",
    });
  }

  let updatedRecord = { name, value, type };

  let recordData = await Record.findOneAndUpdate(
    { _id: id },
    { $set: updatedRecord },
    { new: true }
  );

  if (recordData) {
    return res.status(200).send({
      message: "Record updated successfully !!",
      data: recordData,
    });
  } else {
    return res.status(500).send({
      message: "Error while updating a Record !!",
    });
  }
};

const deleteRecord = async (req, res) => {
  let id = req.params.id;

  let recordData = await Record.findOneAndDelete({ _id: id });

  if (recordData) {
    return res.status(200).send({
      message: "Record deleted successfully !!",
      data: recordData,
    });
  } else {
    return res.status(500).send({
      message: "Error while deleting a Record !!",
    });
  }
};

module.exports = {
  addRecord,
  getAllRecord,
  getRecord,
  updateRecord,
  deleteRecord,
};

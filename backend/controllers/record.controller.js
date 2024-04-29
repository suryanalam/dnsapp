const {
  Route53Client,
  ListResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommand,
} = require("@aws-sdk/client-route-53");
let mongoose = require("mongoose");
require("dotenv").config();

const HostedZoneId = process.env.AWS_HOSTED_ZONE_ID;
const config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
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

  const input = {
    HostedZoneId: HostedZoneId,
    ChangeBatch: {
      Comment: "Creating a New Record",
      Changes: [
        {
          Action: "CREATE",
          ResourceRecordSet: {
            Name: name,
            Type: type,
            TTL: 500,
            ResourceRecords: [
              {
                Value: value,
              },
            ],
          },
        },
      ],
    },
  };

  const command = new ChangeResourceRecordSetsCommand(input);
  const response = await client.send(command);

  if(response.$metadata.httpStatusCode !== 200){
    return res.send({
      message: "Error while adding a Record in AWS !!",
    })
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
      message: "Error while adding a Record in DB !!",
    });
  }
};

const getAllRecord = async (req, res) => {
  let { id } = req.user;

  let recordData = await Record.find({ uid: id });

  if (recordData) {
    return res.status(200).send({
      message: "Records found successfully !!",
      data: recordData,
    });
  } else {
    return res.status(500).send({
      message: "Error while fetching records !!",
    });
  }
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

  let recordPrevData = await Record.findOne({ _id: id });
  console.log('new data: ',name, type, value);
  console.log('prev data: ',recordPrevData.name, recordPrevData.type, recordPrevData.value);

  const prevRecordName = `${recordPrevData.name}.`;

  if(!recordPrevData){
    return res.status(404).send({
      message: "Record not found !!",
    });
  }

  const input = {
    HostedZoneId: HostedZoneId,
    ChangeBatch: {
      Comment: "Updating an Existing Record (using Indirect method)",
      Changes: [
        {
          Action: "DELETE",
          ResourceRecordSet: {
            Name: prevRecordName,
            Type: recordPrevData.type,
            TTL: 500,
            ResourceRecords: [
              {
                Value: recordPrevData.value,
              },
            ],
          },
        },
        {
          Action: "CREATE",
          ResourceRecordSet: {
            Name: name,
            Type: type,
            TTL: 300,
            ResourceRecords: [
              {
                Value: value,
              },
            ],
          },
        },
      ],
    },
  };

  const command = new ChangeResourceRecordSetsCommand(input);
  const response = await client.send(command);

  if(response.$metadata.httpStatusCode !== 200){
    return res.send({
      message: "Error while updating a Record in AWS !!",
    })
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

  let recordPrevData = await Record.findOne({ _id: id });

  if(!recordPrevData){
    return res.status(404).send({
      message: "Record not found !!",
    });
  }

  const prevRecordName = `${recordPrevData.name}.`;

  const input = {
    HostedZoneId: HostedZoneId,
    ChangeBatch: {
      Comment: "Deleting an Existing Record",
      Changes: [
        {
          Action: "DELETE",
          ResourceRecordSet: {
            Name: prevRecordName,
            Type: recordPrevData.type,
            TTL: 500,
            ResourceRecords: [
              {
                Value: recordPrevData.value,
              },
            ],
          },
        },
      ],
    },
  };

  const command = new ChangeResourceRecordSetsCommand(input);
  const response = await client.send(command);

  if(response.$metadata.httpStatusCode !== 200){
    return res.send({
      message: "Error while deleting a Record in AWS !!",
    })
  }

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

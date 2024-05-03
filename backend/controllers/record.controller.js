const {
  Route53Client,
  ChangeResourceRecordSetsCommand,
} = require("@aws-sdk/client-route-53");
let mongoose = require("mongoose");
require("dotenv").config();

const HostedZone = require("../models/HostedZone");
const Record = mongoose.model("Record");

const config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  },
};

const client = new Route53Client(config);

const addRecord = async (req, res) => {
  let { name, value, type, hosted_zone_id } = req.body;
  let { id: userId } = req.user;
  let hostedZoneData;

  if (!userId || !hosted_zone_id || !name || !value || !type) {
    return res.status(500).send({
      message: "please enter all the required fields !!",
    });
  }

  // query to get hosted zone aws id by using hosted zone mongoDB id
  try {
    let resp = await HostedZone.findOne({ _id: hosted_zone_id });
    if (!resp) {
      return res.status(404).send({
        message: "Hosted Zone details not found !!",
      });
    }

    hostedZoneData = resp;
  } catch (err) {
    console.log("Error while fetching hosted zone details: ", err);
    return res.status(500).send({
      message: "Error while fetching hosted zone details !!",
    });
  }

  // data of the new record to craete in aws
  const input = {
    HostedZoneId: hostedZoneData.id,
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

  // create a record in aws route53 using SDK
  try {
    const command = new ChangeResourceRecordSetsCommand(input);
    const response = await client.send(command);

    if (!response) {
      return res.status(404).send({
        message: "Response from AWS is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while creating record in AWS: ", err);
    return res.status(500).send({
      message: "Error while creating record in AWS !!",
    });
  }

  // updated data for records count of hosted zone in DB
  let updatedHostedZone = { records_count: hostedZoneData.records_count + 1 };

  // query to update records count in hosted zone in DB
  try {
    let resp = await HostedZone.findOneAndUpdate(
      { _id: hosted_zone_id },
      { $set: updatedHostedZone },
      { new: true }
    );

    if (!resp) {
      return res.status(500).send({
        message: "Hosted Zone record count not updated in DB !!!",
      });
    }
  } catch (err) {
    return res.status(500).send({
      message:
        "Errow while updating records count of the Hosted Zone in DB. !!",
    });
  }

  // new record data to insert in DB
  let newRecord = {
    uid: userId,
    hosted_zone_id,
    name,
    value,
    type,
  };

  // query to create a new record in hosted zone in DB
  try {
    let record = new Record(newRecord);
    let recordData = await record.save();
    if (recordData) {
      return res.status(200).send({
        message: "Record created successfully !!",
        data: recordData,
      });
    } else {
      return res.status(404).send({
        message: "Response after creating a record is not found !!",
        data: recordData,
      });
    }
  } catch (err) {
    console.log("Error while creating a record in DB: ", err);
    return res.status(404).send({
      message: "Error while creating a record in DB !!",
    });
  }
};

const getAllRecord = async (req, res) => {
  let { id: userId } = req.user;

  try {
    let records = await Record.find({ uid: userId }).populate(
      "hosted_zone_id",
      "id"
    );
    if (records) {
      return res.status(200).send({
        message: "Records found successfully !!",
        data: records,
      });
    } else {
      return res.status(404).send({
        message: "Records not found !!",
      });
    }
  } catch (err) {
    console.log("Error while fetching records from DB !!", err);
    return res.status(500).send({
      message: "Error while fetching records from DB !!",
    });
  }
};

const getRecord = async (recordId) => {
  try {
    let resp = await Record.findOne({ _id: recordId }).populate(
      "hosted_zone_id",
      "id"
    );
    return { resp };
  } catch (err) {
    console.log("Error while fetching a record details: ", err);
    return null;
  }
};



const updateRecord = async (req, res) => {
  let { name, value, type } = req.body;
  let recordId = req.params.id;
  let recordPrevData;

  if (!name || !value || !type) {
    return res.status(404).send({
      message: "please enter all the required fields !!",
    });
  }

  // to fetch existed record details in DB
  let { resp } = await getRecord(recordId);

  if (resp === null) {
    return res.status(404).send({
      message: "Record details not found !!",
    });
  }

  recordPrevData = resp; // existed record data

  // data of the new record to update in aws
  const input = {
    HostedZoneId: recordPrevData.hosted_zone_id.id,
    ChangeBatch: {
      Comment: "Updating an Existing Record",
      Changes: [
        {
          Action: "DELETE",
          ResourceRecordSet: {
            Name: `${recordPrevData.name}.`,
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

  // update a record in aws route53 using SDK
  try {
    const command = new ChangeResourceRecordSetsCommand(input);
    const response = await client.send(command);

    if (!response) {
      return res.status(404).send({
        message: "Response from AWS is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while updating record in AWS: ", err);
    return res.status(500).send({
      message: "Error while updating record in AWS !!",
    });
  }

  // updated data of the existing record in DB
  let updatedRecord = { name, value, type };

  //query to update the data of existed record in DB
  try {
    let recordData = await Record.findOneAndUpdate(
      { _id: recordId },
      { $set: updatedRecord },
      { new: true }
    );

    if (recordData) {
      return res.status(200).send({
        message: "Record updated successfully !!",
        data: recordData,
      });
    } else {
      return res.status(404).send({
        message: "Response after updating a record is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while updating a record in DB: ", err);
    return res.status(500).send({
      message: "Error while updating a record in DB !!",
    });
  }
};

const deleteRecord = async (req, res) => {
  let recordId = req.params.id;
  let hostedZoneData;
  let recordPrevData;

  // to fetch existed record details in DB
  let { resp } = await getRecord(recordId);

  if (resp === null) {
    return res.status(404).send({
      message: "Record details not found !!",
    });
  }

  recordPrevData = resp; // existed record data

  // data of the existed record to delete in aws
  const input = {
    HostedZoneId: recordPrevData.hosted_zone_id.id,
    ChangeBatch: {
      Comment: "Deleting an Existing Record",
      Changes: [
        {
          Action: "DELETE",
          ResourceRecordSet: {
            Name: `${recordPrevData.name}.`,
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

  // delete a record in aws route53 using SDK
  try {
    const command = new ChangeResourceRecordSetsCommand(input);
    const response = await client.send(command);

    if (!response) {
      return res.status(404).send({
        message: "Response from AWS is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while deleting record in AWS: ", err);
    return res.status(500).send({
      message: "Error while deleting record in AWS !!",
    });
  }

  // query to get hosted zone details of the existed record to get records count
  try {
    let resp = await HostedZone.findOne({ _id: recordPrevData.hosted_zone_id._id });
    if (!resp) {
      return res.status(404).send({
        message: "Hosted Zone for the record not found !!",
      });
    }

    hostedZoneData = resp;
  } catch (err) {
    console.log("Error while fetching hosted zone for the record: ", err);
    return res.status(500).send({
      message: "Error while fetching hosted zone for the record !!",
    });
  }

  // updated data for records count of hosted zone in DB
  let updatedHostedZone = { records_count: hostedZoneData.records_count - 1 };

  // query to update records count in hosted zone in DB
  try {
    let resp = await HostedZone.findOneAndUpdate(
      { _id: hostedZoneData._id },
      { $set: updatedHostedZone },
      { new: true }
    );

    if (!resp) {
      return res.status(500).send({
        message: "Hosted Zone record count not updated in DB !!!",
      });
    }
  } catch (err) {
    return res.status(500).send({
      message:
        "Errow while updating records count of the Hosted Zone in DB. !!",
    });
  }

  // query to delete the existed record in DB
  try {
    let recordData = await Record.findOneAndDelete({ _id: recordId });

    if (recordData) {
      return res.status(200).send({
        message: "Record deleted successfully !!",
        data: recordData,
      });
    } else {
      return res.status(404).send({
        message: "Response after deleting a record is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while deleting a record in DB: ", err);
    return res.status(500).send({
      message: "Error while deleting a record in DB !!",
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

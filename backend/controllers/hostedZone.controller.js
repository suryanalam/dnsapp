const {
  Route53Client,
  CreateHostedZoneCommand,
  UpdateHostedZoneCommentCommand,
  DeleteHostedZoneCommand,
} = require("@aws-sdk/client-route-53");
let mongoose = require("mongoose");
require("dotenv").config();

const Record = require("../models/Record");
const HostedZone = mongoose.model("HostedZone");

const config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  },
};

const client = new Route53Client(config);

const addHostedZone = async (req, res) => {
  let hostedZoneId, is_private, records_count;
  let { name, description = "" } = req.body;
  let { id: userId } = req.user;

  if (!userId || !name) {
    return res.status(500).send({
      message: "please enter all the required fields !!",
    });
  }

  // unique id for caller refernece id
  let date = new Date();
  let unique_id = `${date.getDate()}${date.getTime()}`;

  // data to create a hosted zone in aws
  const input = {
    Name: name,
    CallerReference: unique_id,
    HostedZoneConfig: {
      Comment: description,
      PrivateZone: false,
    },
  };

  // create a hosted zone in aws using SDK
  try {
    const command = new CreateHostedZoneCommand(input);
    const response = await client.send(command);

    if (!response) {
      return res.status(404).send({
        message: "Response after creating a Hosted Zone in AWS is not found !!",
      });
    }

    hostedZoneId = response.HostedZone.Id.split("/")[2];
    is_private = response.HostedZone.Config.PrivateZone;
    records_count = response.HostedZone.ResourceRecordSetCount - 2;
  } catch (err) {
    return res.status(500).send({
      message: "Error while creating a Hosted Zone in AWS !!",
    });
  }

  // data of new hosted zone to insert in DB
  let newHostedZone = {
    uid: userId,
    id: hostedZoneId,
    name,
    description,
    is_private,
    records_count,
  };

  // query to create a hosted zone in DB
  try {
    let hostedZone = new HostedZone(newHostedZone);
    let hostedZoneData = await hostedZone.save();

    if (hostedZoneData) {
      return res.status(200).send({
        message: "Hosted Zone created in DB successfully !!",
        data: hostedZoneData,
      });
    } else {
      return res.status(404).send({
        message: "Response after creating a Hosted Zone in DB is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while creating a hosted zone in DB: ", err);
    return res.status(500).send({
      message: "Error while creating a hosted zone in DB !!",
    });
  }
};

const getAllHostedZone = async (req, res) => {
  let { id: userId } = req.user;

  try {
    let hostedZoneData = await HostedZone.find({ uid: userId });

    if (hostedZoneData) {
      return res.status(200).send({
        message: "Hosted Zones found successfully !!",
        data: hostedZoneData,
      });
    } else {
      return res.status(404).send({
        message: "Hosted Zones not found !!",
      });
    }
  } catch (err) {
    console.log("Error while fetching Hosted Zones from DB: ", ErrorEvent);
    return res.status(500).send({
      message: "Error while fetching Hosted Zones !!",
    });
  }
};

const getHostedZone = async (req, res) => {
  let id = req.params.id;

  try {
    let hostedZoneData = await HostedZone.findOne({ _id: id });

    if (hostedZoneData) {
      return res.status(200).send({
        message: "Hosted Zone found successfully !!",
        data: hostedZoneData,
      });
    } else {
      return res.status(404).send({
        message: "Hosted Zone not found !!",
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: "Error while fetching Hosted Zone details !!",
    });
  }
};

const updateHostedZone = async (req, res) => {
  let { description } = req.body;
  let id = req.params.id;
  let hostedZonePrevData;

  // query to fetch existed hosted zone details
  try {
    let resp = await HostedZone.findOne({ _id: id });

    if (!resp) {
      return res.status(404).send({
        message: "Hosted Zone not found !!",
      });
    }

    hostedZonePrevData = resp;
  } catch (err) {
    return res.status(500).send({
      message: "Error while fetching Hosted Zone details !!",
    });
  }

  // if description is not modified, then return and kill the function
  if (description === hostedZonePrevData.description) {
    return res.status(200).send({
      message: "No modification to existing description !!",
    });
  }

  // data to update hosted zone in aws
  let input = {
    Id: hostedZonePrevData.id,
    Comment: description,
  };

  // update the hosted zone data in aws using SDK
  try {
    const command = new UpdateHostedZoneCommentCommand(input);
    const response = await client.send(command);

    if (!response) {
      return res.status(404).send({
        message: "Response from AWS is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while updating a Hosted Zone in AWS: ", err);
    return res.status(500).send({
      message: "Error while updating a Hosted Zone in AWS !!",
    });
  }

  // data to update the hosted zone in DB
  let updatedHostedZone = { description };

  // query to update the data in DB
  try {
    let hostedZoneData = await HostedZone.findOneAndUpdate(
      { _id: id },
      { $set: updatedHostedZone },
      { new: true }
    );

    if (hostedZoneData) {
      return res.status(200).send({
        message: "Hosted Zone updated successfully !!",
        data: hostedZoneData,
      });
    } else {
      return res.status(404).send({
        message: "Response after updating a Hosted Zone in DB is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while updating a Hosted Zone in DB: ", err);
    return res.status(500).send({
      message: "Error while updating a Hosted Zone in DB !!",
    });
  }
};

const deleteHostedZone = async (req, res) => {
  let id = req.params.id;
  let hostedZonePrevData;

  // fetch existed hosted zone details (aws id)
  try {
    let resp = await HostedZone.findOne({ _id: id });

    if (!resp) {
      return res.status(404).send({
        message: "Hosted Zone not found !!",
      });
    }

    console.log('existed hosted zone data: ',resp);
    hostedZonePrevData = resp;
  } catch (err) {
    return res.status(500).send({
      message: "Error while fetching Hosted Zone details !!",
    });
  }

  // data to delete the existed hosted zone in aws
  const input = {
    Id: hostedZonePrevData.id,
  };

  // delete the hosted zone in aws using SDK
  try {
    const command = new DeleteHostedZoneCommand(input);
    const response = await client.send(command);

    if (!response) {
      return res.status(404).send({
        message: "Response from AWS is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while deleting a Hosted Zone in AWS: ", err);
    return res.status(500).send({
      message: "Error while deleting a Hosted Zone in AWS !!",
    });
  }

  // query to delete the hosted zone in DB
  try {
    let hostedZoneData = await HostedZone.findOneAndDelete({ _id: id });

    if (hostedZoneData) {
      return res.status(200).send({
        message: "Hosted Zone deleted successfully !!",
        data: hostedZoneData,
      });
    } else {
      return res.status(404).send({
        message: "Response after deleting a Hosted Zone in DB is not found !!",
      });
    }
  } catch (err) {
    console.log("Error while deleting a Hosted Zone in DB: ", err);
    return res.status(500).send({
      message: "Error while deleting a Hosted Zone in DB!!",
    });
  }
};

module.exports = {
  addHostedZone,
  getAllHostedZone,
  getHostedZone,
  updateHostedZone,
  deleteHostedZone,
};

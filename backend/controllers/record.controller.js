let mongoose = require("mongoose");
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

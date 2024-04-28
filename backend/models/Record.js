let mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
});

recordSchema.index({ name: 1, type: 1 }, { unique: true });

const Record = mongoose.model("Record", recordSchema);
module.exports = Record;
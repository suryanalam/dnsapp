let mongoose = require("mongoose");

const hostedZoneSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  is_private: {
    type: Boolean,
    required: true,
    default: false
  },
  records_count: {
    type: Number,
    required: true,
    default: 0,
    min: [0,"Records count can't be negative !!"],
  }
});

const HostedZone = mongoose.model("HostedZone", hostedZoneSchema);
module.exports = HostedZone;
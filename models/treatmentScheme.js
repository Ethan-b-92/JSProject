const mongoose = require("mongoose");

const TreatmentSchema = new mongoose.Schema({
    treatmentNumber: {
    type: String,
    required: true,
  },
  treatmentInfo: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    default: Date.now,
  },
  workerEmail: {
    type: String,
    required: true,
  },
  carNumber: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Treatment = mongoose.model("Treatment", TreatmentSchema);

module.exports = Treatment;

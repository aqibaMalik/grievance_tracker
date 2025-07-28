const mongoose = require("mongoose")

const GrievanceSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  post: {
    type: String,
  },
  issueType: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
  },
})

module.exports = mongoose.model("Grievance", GrievanceSchema)

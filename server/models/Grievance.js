const mongoose = require("mongoose")

const GrievanceSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
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
    trim: true,
  },
  issueType: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Under Review", "Resolved", "Rejected"],
    default: "Pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model("Grievance", GrievanceSchema)

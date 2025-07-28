require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const Grievance = require("./models/Grievance")

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("mongodb connected")
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
  try {
    const data = await Grievance.find()
    res.status(200).json(data)
  } catch (err) {
    res.sendStatus(400).json({ message: err.message })
  }
})
app.post("/submitGrievance", async (req, res) => {
  const { fname, email, district, board, post, issueType, desc } = req.body

  try {
    const grievance = new Grievance({
      fname,
      email,
      district,
      board,
      post,
      issueType,
      desc,
    })
    await grievance.save()
    res.status(201).json({ message: "Grievance Lodged Successfully" })
    console.log("Submited grievance -- Server")
  } catch (err) {
    res.status(400).json(err)
  }
})

app.listen(3000, () => console.log("Server running on 3000"))

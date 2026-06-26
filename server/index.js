require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Grievance = require("./models/Grievance")
const User = require("./models/User")

const app = express()
const JWT_SECRET = process.env.JWT_SECRET || "jk_grievance_secret_key_123"
const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin_super_secret_999"

// DB Connection
console.log({ uri: process.env.MONGODB_URI })
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message)
    process.exit(1)
  })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ─── Middleware: Optional user auth ─────────────────────────────────────────
const getOptionalUser = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    req.user = null
    return next()
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null
    } else {
      req.user = decoded
    }
    next()
  })
}

// ─── Middleware: Required admin auth ─────────────────────────────────────────
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Admin access required. No token provided." })
  }
  jwt.verify(token, ADMIN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired admin token." })
    }
    req.admin = decoded
    next()
  })
}

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// Get all grievances (sorted by most recent)
app.get("/", async (req, res) => {
  try {
    const data = await Grievance.find().sort({ createdAt: -1 })
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Submit Grievance
app.post("/submitGrievance", getOptionalUser, async (req, res) => {
  const { fname, email, district, board, post, issueType, desc } = req.body

  if (!fname || !email || !district || !board || !issueType) {
    return res.status(400).json({ message: "Please fill all required fields" })
  }

  try {
    const grievanceData = {
      fname,
      email,
      district,
      board,
      post,
      issueType,
      desc,
      status: "Pending"
    }

    if (req.user) {
      grievanceData.user = req.user.userId
    }

    const grievance = new Grievance(grievanceData)
    await grievance.save()
    res.status(201).json({ message: "Grievance Lodged Successfully", grievanceId: grievance._id })
    console.log("Submitted grievance -- Server")
  } catch (err) {
    res.status(400).json({ message: err.message || err })
  }
})

// Track Grievance Status
app.get("/api/grievances/track/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Grievance ID format" })
    }

    const grievance = await Grievance.findById(id)
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" })
    }

    res.status(200).json(grievance)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
      message: "Registered successfully"
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "24h" })

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
      message: "Logged in successfully"
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get currently logged-in user's grievances
app.get("/api/grievances/my-grievances", getOptionalUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." })
    }

    const grievances = await Grievance.find({ user: req.user.userId }).sort({ createdAt: -1 })
    res.status(200).json(grievances)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── ADMIN ROUTES (protected) ─────────────────────────────────────────────────

// Admin Login — issues a special admin JWT
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body
  if (!password) {
    return res.status(400).json({ message: "Password required" })
  }

  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin@grievance2024"
  if (password !== ADMIN_PASS) {
    return res.status(401).json({ message: "Invalid admin password" })
  }

  const token = jwt.sign({ role: "admin" }, ADMIN_SECRET, { expiresIn: "8h" })
  res.status(200).json({ token, message: "Admin logged in successfully" })
})

// Get ALL grievances for admin (paginated)
app.get("/api/admin/grievances", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const [grievances, total] = await Promise.all([
      Grievance.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Grievance.countDocuments()
    ])

    res.status(200).json({ grievances, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update grievance status (Admin only)
app.patch("/api/admin/grievances/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Grievance ID" })
    }

    const validStatuses = ["Pending", "Under Review", "Resolved", "Rejected"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` })
    }

    const grievance = await Grievance.findByIdAndUpdate(id, { status }, { new: true })

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" })
    }

    res.status(200).json({ message: "Status updated successfully", grievance })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete a grievance (Admin only)
app.delete("/api/admin/grievances/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Grievance ID" })
    }

    const grievance = await Grievance.findByIdAndDelete(id)

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" })
    }

    res.status(200).json({ message: "Grievance deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

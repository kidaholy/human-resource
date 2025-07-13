import User from "../models/User.js"
import Applicant from "../models/Applicant.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(404).json({ success: false, error: "Wrong password" })
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: "10d" })

    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const registerApplicant = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already in use" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user with applicant role
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "applicant",
    })

    await newUser.save()

    // Create applicant profile
    const newApplicant = new Applicant({
      user: newUser._id,
      name,
      email,
      phone,
      applications: [],
    })

    await newApplicant.save()

    // Generate token
    const token = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_KEY, { expiresIn: "10d" })

    res.status(201).json({
      success: true,
      token,
      user: { _id: newUser._id, name: newUser.name, role: newUser.role },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}

const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user })
}

export { login, verify, registerApplicant }


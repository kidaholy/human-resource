import express from "express"
import cors from "cors"
import connectToDatabase from "./db/db.js"
import authRouter from "./routes/auth.js"
import departmentRouter from "./routes/department.js"
import employeeRouter from "./routes/employee.js"
import salaryRouter from "./routes/salary.js"
import { router as leaveRouter } from "./routes/leave.js"
import vacancyRouter from "./routes/vacancy.js"
import applicantRouter from "./routes/applicant.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// First connect to database
connectToDatabase()

// Then initialize the Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public/uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve static files from the uploads directory with proper MIME types
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf')
    }
  }
}))

// Routes
app.use("/api/auth", authRouter)
app.use("/api/departments", departmentRouter)
app.use("/api/employees", employeeRouter)
app.use("/api/salary", salaryRouter)
app.use("/api/leave", leaveRouter)
app.use("/api/vacancies", vacancyRouter)
app.use("/api/applicants", applicantRouter)

// Start the server
app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT)
  console.log("Static files served from:", uploadsDir)
})
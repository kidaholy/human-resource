import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.js"
import departmentRouter from "./routes/department.js"
import employeeRouter from "./routes/employee.js"
import salaryRouter from "./routes/salary.js"
import { router as leaveRouter } from "./routes/leave.js"
import vacancyRouter from "./routes/vacancy.js"
import connectToDatabase from "./db/db.js"

connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRouter)
app.use(express.static("public/uploads"))
app.use("/api/departments", departmentRouter)
app.use("/api/employees", employeeRouter)
app.use("/api/salary", salaryRouter)
app.use("/api/leave", leaveRouter)
app.use("/api/vacancies", vacancyRouter)
app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT)
})


import mongoose from "mongoose"

const departmentSchema = new mongoose.Schema({
  dep_name: { type: String, required: true },
  description: { type: String },
  departmentHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
})

const Department = mongoose.model("Department", departmentSchema)

export default Department


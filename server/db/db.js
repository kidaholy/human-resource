import mongoose from "mongoose"

const connectToDatabase = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    console.log("MongoDB URL:", process.env.MONGODB_URL ? "Set" : "Not set")
    
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not set")
    }
    
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log("Successfully connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection error:", error.message)
    console.error("Full error:", error)
    process.exit(1) // Exit the process if database connection fails
  }
}

export default connectToDatabase


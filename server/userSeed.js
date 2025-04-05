import User from "./models/User.js"
import bcrypt from "bcrypt"
import connectToDatabase from "./db/db.js"

const userRegister = async () => {
  connectToDatabase()
  try {
    const hashPassword = await bcrypt.hash("admin", 10)
    const newUser = new User({
      name: "Kidus",
      email: "kidayos2014@gmail.com",
      password: hashPassword,
      role: "admin",
    })
    await newUser.save()
    console.log("Connected to database")
  } catch (error) {
    console.log(error)
  }
}

userRegister()


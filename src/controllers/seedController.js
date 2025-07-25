const data = require("../data")
const User = require("../models/userModel")

const seedUser = async (req, res, next) => {
  try {
    // delete all existing users
    await User.deleteMany({})

    // create new users
    const users = await User.insertMany(data.users)
    return res.status(201).json(users)
  } catch (error) {
    next(error) // send error to the app.js server error handle
  }
}

module.exports = { seedUser }

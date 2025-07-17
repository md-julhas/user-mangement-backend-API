const mongoose = require("mongoose")
const createError = require("http-errors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const { createJSONWebToken } = require("../helper/jsonwebtoken")
const User = require("../models/userModel")
const { deleteImage } = require("../helper/deleteImage")
const { jwtRestPasswordKey, clientURL } = require("../secret")
const { emailWithNodemailer } = require("../helper/email")
const sendEmail = require("../helper/sendEmail")

const findUsers = async (search, limit, page) => {
  try {
    const searchRegExp = new RegExp(".*" + search + ".*", "i")
    const filter = {
      isAdmin: { $ne: true }, // all users will show without admin
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
        { address: { $regex: searchRegExp } },
      ],
    }

    const options = { password: 0 } // don't show password

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit)

    const count = await User.find(filter).countDocuments()

    if (!users || users.length === 0) throw createError(404, "no users found")

    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    }
  } catch (error) {
    throw error
  }
}

const findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options)
    if (!user) throw createError(404, "User does not exist with this id")
    return user
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id")
    }
    throw error
  }
}
const deleteUserById = async (id, options = {}) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    })

    if (user?.image && !user.image.includes("default_user.png")) {
      await deleteImage(user.image)
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id")
    }
    throw error
  }
}

const updateUserById = async (userId, req) => {
  try {
    const options = { password: 0 }
    const user = await findUserById(userId, options)

    const updateOptions = { new: true, runValidators: true, context: "query" }
    let updates = {}
    const allowedFields = ["name", "phone", "address"]
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key]
      } else if (key === "email") {
        throw createError(400, "email cannot be updated")
      }
    }

    const image = req.file?.path
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "Image size is too large. It must be less than 2 MB"
        )
      }
      updates.image = image
      user.image !== "default_user.png" && deleteImage(user.image)
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password")

    if (!updatedUser) {
      throw createError(404, "User with this id does not exist")
    }
    return updatedUser
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id")
    }
    throw error
  }
}
const updateUserPasswordById = async (
  userId,
  email,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      throw createError(404, "User does not exist with this email")
    }

    // Compare old password with database password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordMatch) {
      throw createError(400, "Old password didn't match. please try again")
    }
    if (newPassword !== confirmPassword) {
      throw createError(400, "new password and confirm password did not match")
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    ).select("-password")

    if (!updatedUser) {
      throw createError(400, "User password was not update successfully")
    }
    return updatedUser
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id")
    }
    throw error
  }
}
const forgetPasswordByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      throw createError(
        404,
        "User not found with this email. Please register first."
      )
    }

    const token = createJSONWebToken({ email }, jwtRestPasswordKey, "10m")

    // prepare email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `<h2>Hello ${user.name}!</h2>
      <p>Please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">Reset your password</a></p>
      `,
    }

    // send email to the user with nodemailer
    sendEmail(emailData)

    return token
  } catch (error) {
    throw error
  }
}
const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtRestPasswordKey)

    if (!decoded) throw createError(400, "Invalid or expired token")

    const filter = { email: decoded.email }
    const update = { password: password }
    const options = { new: true }
    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select("-password")

    if (!updatedUser) {
      throw createError(400, "User password reset failed")
    }
  } catch (error) {
    throw error
  }
}

const handleUserAction = async (userId, action) => {
  try {
    let update
    let successMessage
    if (action === "ban") {
      update = { isBanned: true }
      successMessage = "user was banned successfully"
    } else if (action === "unban") {
      update = { isBanned: false }
      successMessage = "user was unbanned successfully"
    } else {
      throw createError(400, "Invalid action. Please choose 'ban' or 'unban'")
    }

    const updateOptions = { new: true, runValidators: true, context: "query" }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password")

    if (!updatedUser) {
      throw createError(400, "User was banned succesfully")
    }
    return successMessage
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id")
    }
    throw error
  }
}

module.exports = {
  findUsers,
  findUserById,
  deleteUserById,
  updateUserById,
  updateUserPasswordById,
  forgetPasswordByEmail,
  resetPassword,
  handleUserAction,
}

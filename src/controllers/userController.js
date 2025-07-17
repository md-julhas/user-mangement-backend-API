const createError = require("http-errors")
const jwt = require("jsonwebtoken")

const User = require("../models/userModel")
const { successResponse } = require("./responseController")
const { findWithId } = require("../services/findItem")
const { deleteImage } = require("../helper/deleteImage")
const { createJSONWebToken } = require("../helper/jsonwebtoken")
const { jwtActivationKey, clientURL, jwtRestPasswordKey } = require("../secret")
const { emailWithNodemailer } = require("../helper/email")
const {
  handleUserAction,
  findUsers,
  findUserById,
  deleteUserById,
  updateUserById,
  updateUserPasswordById,
  forgetPasswordByEmail,
  resetPassword,
} = require("../services/userService")
const checkUserExists = require("../helper/checkUserExist")
const sendEmail = require("../helper/sendEmail")

const handleGetUsers = async (req, res, next) => {
  try {
    const search = req.query.search || ""
    const page = Number(req.query.page) || 1
    const limit = req.query.limit || 5

    const { users, pagination } = await findUsers(search, limit, page)

    return successResponse(res, {
      statusCode: 200,
      message: "users were retuned successfully",
      payload: {
        users,
        pagination,
      },
    })
  } catch (error) {
    next(error)
  }
}

const handleGetUserById = async (req, res, next) => {
  try {
    const id = req.params.id
    const options = { password: 0 }
    const user = await findUserById(id, options)

    return successResponse(res, {
      statusCode: 200,
      message: "user was retuned successfully",
      payload: { user },
    })
  } catch (error) {
    next(error)
  }
}

const handleDeleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id
    const options = { password: 0 }
    await deleteUserById(id, options)

    return successResponse(res, {
      statusCode: 200,
      message: "user was deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

const handleProcecssRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body

    const image = req.file?.path
    if (image && image.size > 1024 * 1024 * 2) {
      throw createError(
        400,
        "Image size is too large. It must be less than 2 MB"
      )
    }

    const userExists = await checkUserExists(email)
    if (userExists) {
      throw createError(
        409,
        "User already exists with this email, Please sign in"
      )
    }

    // create jwt token
    const tokenPayload = {
      name,
      email,
      password,
      phone,
      address,
    }
    // if image exists then insert this into the tokenPayload
    if (image) {
      tokenPayload.image = image
    }
    const token = createJSONWebToken(tokenPayload, jwtActivationKey, "10m")

    // prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `<h2>Hello ${name}!</h2>
      <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `,
    }

    sendEmail(emailData)

    return successResponse(res, {
      statusCode: 200,
      message: `please got to your ${email} for completing your registration process`,
      payload: { token },
    })
  } catch (error) {
    next(error)
  }
}

const handleActivateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token
    if (!token) throw createError(404, "token not found")

    try {
      const decoded = jwt.verify(token, jwtActivationKey) // verify token and store data in decoded variable
      if (!decoded) throw createError(401, "Unable to verify user")

      // To prevent two time registration with 10 minutes
      const userExists = await User.exists({ email: decoded.email })
      if (userExists) {
        throw createError(
          409,
          "User already exists with this email. Please sign in"
        )
      }

      await User.create(decoded)

      return successResponse(res, {
        statusCode: 201,
        message: `user account verified successfully`,
      })
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "token has expired")
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "invalid token")
      } else {
        throw error
      }
    }
  } catch (error) {
    next(error)
  }
}

const handleUpdateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id
    const updatedUser = await updateUserById(userId, req)

    return successResponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
const handleManageUserStatusById = async (req, res, next) => {
  try {
    const userId = req.params.id
    const action = req.body.action

    const successMessage = await handleUserAction(userId, action)

    return successResponse(res, {
      statusCode: 200,
      message: successMessage,
    })
  } catch (error) {
    next(error)
  }
}

const handleUpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body
    const userId = req.params.id

    const updatedUser = await updateUserPasswordById(
      userId,
      email,
      oldPassword,
      newPassword,
      confirmPassword
    )

    return successResponse(res, {
      statusCode: 200,
      message: "User password was updated successfully",
      payload: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const token = await forgetPasswordByEmail(email)

    return successResponse(res, {
      statusCode: 200,
      message: `please got to your ${email} for reseting password`,
      payload: { token },
    })
  } catch (error) {
    next(error)
  }
}
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body
    await resetPassword(token, password)
    return successResponse(res, {
      statusCode: 200,
      message: "Password reset successfully completed",
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleGetUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleProcecssRegister,
  handleActivateUserAccount,
  handleUpdateUserById,
  handleManageUserStatusById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
}

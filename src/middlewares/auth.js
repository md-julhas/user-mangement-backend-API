const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const { jwtAccessKey } = require("../secret")
const isLoggedIn = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
      throw createError(401, "Access token not found. Please login.")
    }
    const decoded = jwt.verify(accessToken, jwtAccessKey)
    if (!decoded) {
      throw createError(401, "Invalid access token. Please log in again.")
    }

    req.user = decoded.user

    next()
  } catch (error) {
    return next(error)
  }
}
const isLoggedOut = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtAccessKey)
        if (decoded) {
          throw createError(400, "User is already logged in.")
        }
      } catch (error) {
        throw error
      }
    }
    next()
  } catch (error) {
    return next(error)
  }
}
const isAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw createError(
        403,
        "You must be an administrator to access this resource."
      )
    }
    next()
  } catch (error) {
    return next(error)
  }
}

module.exports = { isLoggedIn, isLoggedOut, isAdmin }

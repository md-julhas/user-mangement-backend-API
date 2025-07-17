const jwt = require("jsonwebtoken")
const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be an object and not empty")
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("secretKey must be a string and not empty")
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn })
    return token
  } catch (error) {
    console.error("Failed to sign the JWT", error)
    throw error
  }
}

module.exports = { createJSONWebToken }

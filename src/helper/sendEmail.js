const createError = require("http-errors")
const { emailWithNodemailer } = require("./email")

const sendEmail = async (emailData) => {
  try {
    await emailWithNodemailer(emailData)
  } catch (emailError) {
    throw createError(500, "failed to send verification email")
  }
}
module.exports = sendEmail

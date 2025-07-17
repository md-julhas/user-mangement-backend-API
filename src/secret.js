require("dotenv").config()

const serverPort = process.env.SERVER_PORT || 3002
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceMernDB"
const defaultUserImage =
  process.env.DEFAULT_USER_IMAGE || "public/images/users/default_user.png"

const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "jkldsfj485990nsdjfl359sd8493klsd"

const jwtAccessKey =
  process.env.JWT_ACCESS_KEY || "jkldsfj485990nsdjfl359sd8493klsddsf"

const jwtRefreshKey =
  process.env.JWT_REFRESH_KEY || "jkldsfj485990nsdjfl359sd8493kdlsddsf"

const jwtRestPasswordKey =
  process.env.JWT_REST_PASSWORD_KEY || "jkldsfj485990nsdjfl359dfdsd8493klsddsf"

const smtpUsername = process.env.SMTP_USERNAME || ""
const smtpPassword = process.env.SMTP_PASSWORD || ""
const clientURL = process.env.CLIENT_URL

module.exports = {
  serverPort,
  mongodbURL,
  defaultUserImage,
  jwtActivationKey,
  jwtAccessKey,
  jwtRefreshKey,
  jwtRestPasswordKey,
  smtpUsername,
  smtpPassword,
  clientURL,
}

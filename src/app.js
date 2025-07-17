const express = require("express")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const createError = require("http-errors")
const xssClean = require("xss-clean")
const rateLimit = require("express-rate-limit")
const cors = require("cors")
const app = express()

const userRouter = require("./routers/userRouter")
const seedRouter = require("./routers/seedRouter")
const { errorResponse } = require("./controllers/responseController")
const authRouter = require("./routers/authRouter")

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: "Too many requests from this IP, please try again in a minute",
})

app.use(cookieParser())
app.use(rateLimiter)
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(xssClean())
app.use(cors())

app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/seed", seedRouter)

app.get("/test", (req, res) => {
  res.status(200).send({ message: "test route is working" })
})

// Client error handling for unknown route
app.use((req, res, next) => {
  next(createError(404, "route not found"))
})

// Server error handling --> all the errors
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  })
})

module.exports = app

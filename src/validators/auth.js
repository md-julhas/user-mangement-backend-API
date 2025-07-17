const { body } = require("express-validator")
// registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required from auth")
    .isLength({ min: 3, max: 50 })
    .withMessage("name should be between 3 and 50 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "password must be at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("address is required")
    .isLength({ min: 5 })
    .withMessage("address should be 8 characters long"),
  body("phone").trim().notEmpty().withMessage("phone is required"),
  body("phone").optional().isString().withMessage("phone is required"),
  body("image").optional().isString().withMessage("image is optional"),
]

// Login validations
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "password must be at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)"
    ),
]
// User update password validations
const validateUserPasswordUpdate = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old password is required")
    .isLength({ min: 8 })
    .withMessage("Old password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "password must be at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)"
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "password must be at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Confirm password does not match with new password")
    }
    return true
  }),
]
const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),
]
const validateUserResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is missing or invalid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "password must be at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)"
    ),
]
// const validateUserRefreshToken = [
//   body("token").trim().notEmpty().withMessage("Token is missing or invalid"),
// ]

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
  // validateUserRefreshToken,
}

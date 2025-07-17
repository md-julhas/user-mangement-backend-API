# User Management API

A Node.js + Express backend for user management, featuring authentication, authorization, email verification, and password reset—ideal for applications requiring secure user account control.

## 🚀 Features

- ✅ **User Registration & Email Verification**

  - Create user accounts with profile image support and email verification via token
  - Token is sent via email to verify the user's email address

- 🔐 **Authentication**

  - User login and logout
  - JSON Web Tokens (JWT) used for authentication
  - Refresh and access tokens stored in cookies for secure session management

- 🧑‍💼 **Admin Features**

  - Get all users with pagination
  - Ban and unban users

- 🛠️ **User Management**

  - View single user details
  - Update user details
  - Delete user
  - Change password (authenticated users)
  - Forgot password flow with token-based email reset

- 📫 **Email Functionality**

  - Send verification and password reset tokens via email

- 🗄️ **Database**

  - MongoDB used as the database with Mongoose ODM

- 📊 **Logging**
  - Winston logger integrated for logging important info and errors

---

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Token (JWT)
- **Email**: Nodemailer
- **Logging**: Winston
- **Session Management**: HTTP-only Cookies

---

## 📫 API Endpoints

### 🧑‍💼 User APIs

| Method | Endpoint                         | Description                                   |
| ------ | -------------------------------- | --------------------------------------------- |
| GET    | `/api/users`                     | Get all users (paginated, admin only)         |
| GET    | `/api/users/:id`                 | Get user by ID                                |
| DELETE | `/api/users/:id`                 | Delete a user                                 |
| POST   | `/api/users/process-register`    | Register a new user                           |
| POST   | `/api/users/verify-user-account` | Verify and activate user via email token      |
| PUT    | `/api/users/:id`                 | Update user profile                           |
| PUT    | `/api/users/manage-user/:id`     | Ban or unban a user                           |
| PUT    | `/api/users/update-password/:id` | Update password using old password and email  |
| POST   | `/api/users/forget-password`     | Request password reset (sends token to email) |
| PUT    | `/api/users/reset-password`      | Reset password using token                    |
| GET    | `/api/seed/users`                | Seed initial users (for development/testing)  |

### 👤 Auth APIs

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| POST   | `/api/auth/login`         | User login                 |
| GET    | `/api/auth/refresh-token` | Generate new refresh token |
| GET    | `/api/auth/protected`     | Check protected route      |
| POST   | `/api/auth/logout`        | Logout and clear cookies   |
| GET    | `/test`                   | Test API connection        |

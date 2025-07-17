const fs = require("fs").promises
const deleteImage = async (userImagePath) => {
  try {
    await fs.access(userImagePath)
    await fs.unlink(userImagePath)
    console.log("user image was deleted successfully")
  } catch (error) {
    console.error("user image does not exist")
    throw error
  }
}

module.exports = { deleteImage }

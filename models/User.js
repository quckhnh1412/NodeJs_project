const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
  },
  status: {
    type: String,
    default: "Locked",
  },
  is_changed_password: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
  expiration_time: {
    type: Date,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;

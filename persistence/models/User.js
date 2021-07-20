const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
  username: { type: String, required: [true, "Username is required"] },
  karma: Number,
  role: String,
  id: String,
  joinDate: Date,
});

const User = mongoose.model("Users", UsersSchema);

module.exports = User;

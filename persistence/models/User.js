const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
  username: { type: String, required: [true, "Username is required"] },
  id: { type: String, required: [true, "ID is required"] },
  karma: Number,
  role: String,
  joinDate: Date,
});

const User = mongoose.model("Users", UsersSchema);

module.exports = User;

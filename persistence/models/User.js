const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
    username: String,
    karma: Number,
    role: String,
    id: String,
    joinDate: Date,
});

const User = mongoose.model('Users', UsersSchema);

module.exports = User;
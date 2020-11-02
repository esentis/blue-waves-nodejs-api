const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
    username: String,
    email: String,
});

const User = mongoose.model('Users', UsersSchema);

module.exports = User;
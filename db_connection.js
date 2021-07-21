var mongoose = require("mongoose");

const uri = `mongodb+srv://esentis:${process.env.MONGODB_PASSWORD}@cluster0.rsv4x.mongodb.net/blue_waves?retryWrites=true&w=majority`;
const localhost = "mongodb://127.0.0.1:27017/blue_waves";
mongoose.connect(localhost, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to db");
});

module.exports = db;

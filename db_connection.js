var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blue_waves", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to db");
});

module.exports = db;

var mongoose = require("mongoose");

const uri = `mongodb+srv://esentis:${process.env.MONGODB_PASSWORD}@cluster0.rsv4x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to db");
});

module.exports = db;

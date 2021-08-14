var mongoose = require("mongoose");
const logger = require("./persistence/helpers/loggers.js");

mongoose.connect(process.env["CONNECTION_STRING"], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  logger.info("Database connection established.");
});

module.exports = db;

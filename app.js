require("dotenv").config();
const path = require("path");
const logger = require("./persistence/helpers/loggers.js");
var express = require("express");
var beaches = require("./persistence/controllers/beach_controller.js");
var ratings = require("./persistence/controllers/rating_controller.js");
var favorites = require("./persistence/controllers/favorite_controller.js");
var users = require("./persistence/controllers/user_controller.js");
var countries = require("./persistence/controllers/country_controller.js");
var images = require("./persistence/controllers/image_controller.js");

require("./db_connection.js");

const app = express();

app.get("/", function (req, res) {
  return res.sendFile(path.join(__dirname, "views/index.html"));
});

app.use(express.json());
app.use("/beaches", beaches);
app.use("/countries", countries);
app.use("/ratings", ratings);
app.use("/favorites", favorites);
app.use("/users", users);
app.use("/images", images);

app.listen(process.env.PORT || 3000, function () {
  logger.info(`Express server listening on port ${process.env.PORT || 3000}`);
});

module.exports = app;

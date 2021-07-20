require("dotenv").config();
var express = require("express");
var beaches = require("./persistence/controllers/beach_controller.js");
var ratings = require("./persistence/controllers/rating_controller.js");
var favorites = require("./persistence/controllers/favorite_controller.js");
var users = require("./persistence/controllers/user_controller.js");

require("./db_connection.js");

const app = express();

app.use(express.json());
app.use("/beaches", beaches);
app.use("/ratings", ratings);
app.use("/favorites", favorites);
app.use("/users", users);

app.listen(3000, function () {
  console.log("Express server listening on port ", 3000);
});

module.exports = app;

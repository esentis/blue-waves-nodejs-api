var express = require('express');

var beaches = require('./persistence/controllers/beach_controller.js')
var ratings = require('./persistence/controllers/rating_controller.js')
var favorites = require('./persistence/controllers/favorite_controller.js')
var users = require('./persistence/controllers/user_controller.js')
var bodyParser = require('body-parser');
require('./db_connection.js');

const app = express();

// create application/json parser
var jsonParser = bodyParser.json()

app.use('/beaches', jsonParser, beaches);
app.use('/ratings', jsonParser, ratings);
app.use('/favorites', jsonParser, favorites);
app.use('/users', jsonParser, users);


app.listen(3000, function () {
    console.log("Express server listening on port ", 3000);
});

module.exports = app;
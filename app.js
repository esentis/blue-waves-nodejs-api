var express = require('express');
// var ads = require('./controllers/adController.js');
// var users = require('./controllers/userController.js');
var beaches = require('./persistence/controllers/beach_controller.js')
var bodyParser = require('body-parser');
require('./db_connection.js');

const app = express();

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })



app.use('/beaches', jsonParser, beaches);
// app.use('/user', jsonParser, users);

app.listen(3000, function () {
    console.log("Express server listening on port ", 3000);
});

module.exports = app;
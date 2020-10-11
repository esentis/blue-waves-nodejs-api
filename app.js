var express = require('express');
// var ads = require('./controllers/adController.js');
var users = require('./persistence/controllers/user_controller.js');
var beaches = require('./persistence/controllers/beach_controller.js')
var bodyParser = require('body-parser');
require('./db_connection.js');
require('./services/passport_config')
const app = express();

// create application/json parser
var jsonParser = bodyParser.json()

app.use('/beaches', jsonParser, beaches);
app.use('/user', jsonParser, users);

app.listen(3000, function () {
    console.log("Express server listening on port ", 3000);
});

module.exports = app;
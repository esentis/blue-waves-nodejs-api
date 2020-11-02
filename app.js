var express = require('express');

var beaches = require('./persistence/controllers/beach_controller.js')
var bodyParser = require('body-parser');
require('./db_connection.js');

const app = express();

// create application/json parser
var jsonParser = bodyParser.json()

app.use('/beaches', jsonParser, beaches);


app.listen(3000, function () {
    console.log("Express server listening on port ", 3000);
});

module.exports = app;
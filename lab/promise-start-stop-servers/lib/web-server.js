'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var appPort = process.env.PORT || 9001;

app.get('/', function(req, res) {
  res.send('Ok');
});

app.get('/sayhello', function(req, res) {
  res.send('Hello World, server running on port: ' + appPort);
});

app.listen(appPort, function () {
  console.log('webserver is listening at http://localhost:%s', appPort);
});

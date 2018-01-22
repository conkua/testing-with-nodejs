'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var logFactory = require('./log-factory');
var LogTracer = require('logolite').LogTracer;

var app = express();
var appPort = process.env.PORT || 9001;
var log = logFactory.getLogger();

app.get('/', function(req, res) {
  res.send('Ok');
});

app.get('/sayhello', function(req, res) {
  var reqTrace = LogTracer.ROOT.branch({
    key: 'requestId', value: req.get('X-Request-Id') || 'not-found'
  });

  log.info && log.info(reqTrace.add({
    port: appPort
  }).toMessage({
    text: '{requestId} + receive new request to server: {port}'
  }));

  if (req.headers.accept === 'application/json') {
    log.info && log.info(reqTrace.toMessage({
      text: '{requestId} - render output as JSON object'
    }));
    res.json({
      message: 'Hello World',
      port: appPort
    });
  } else {
    log.info && log.info(reqTrace.toMessage({
      text: '{requestId} - render output as HTML document'
    }));
    res.send('Hello World, server running on port: ' + appPort);
  }
});

app.listen(appPort, function () {
  console.log('webserver is listening at http://localhost:%s', appPort);
});

'use strict';

var winston = require('winston');

var factory = {};

factory.getLogger = function(level) {
  var logger = new (winston.Logger)({
    level: level || 'info'
  });

  if (process.env.NODE_ENV === 'test') {
    logger.add(winston.transports.Http, {
      host: 'localhost',
      port: 17771
    });
  }

  return logger;
}

module.exports = factory;

'use strict';

var winston = require('winston');

var factory = {};
var logger = null;

factory.getLogger = function(level) {
  if (!logger) {
    logger = new (winston.Logger)({
      level: process.env.LOGGING_LEVEL || level || 'info'
    });

    logger.add(winston.transports.Console, {
      type: 'console',
      level: 'info',
      json: false,
      timestamp: true,
      colorize: true
    });

    if (process.env.NODE_ENV === 'test') {
      logger.add(winston.transports.Http, {
        host: 'localhost',
        port: 17771
      });
    }
  }

  return logger;
}

module.exports = factory;

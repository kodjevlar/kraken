'use strict';
const winston = require('winston');

/**
 * Sets up a new logger
 * @type {Logger}
 */
const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      level: process.env.NODE_ENV === 'development' ? 'silly' : 'warn',
      colorize: true
    }),
    new (winston.transports.File)({
      level: process.env.NODE_ENV === 'development' ? 'silly' : 'info',
      filename: process.env.SYSTEM_LOG || '/dev/null'
    })
  ]
});

module.exports = logger;

const winston = require('winston');
const path = require('path');

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
      filename: path.join(process.env.LOG_DIR, 'system.log')
    })
  ]
});

module.exports = logger;

'use strict';
const winston = require('winston');
const timing = require('../lib/timing');

/**
 * Configure new logger
 */
let logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
    new (winston.transports.File)({
      filename: process.env.ACCESS_LOG || '/dev/null'
    })
  ]
});

/**
 * Creates access log entry
 * @param {Object}   ctx  Koa context    
 * @param {Function} next Next middleware
 * @return {void}
 */
async function accessLogger(ctx, next) {
  await next();

  const userAgent = ctx.req.headers['user-agent'] || 'unknown';
  const msg = `${ctx.ip} ${ctx.state.responseTime}ms "${ctx.req.url}" ` +
    `${ctx.res.statusCode} "${userAgent}"`;
  
  logger.info(msg);
}

/**
 * Swaps out the logger instance (testing purposes)
 * @param {Object} loggerInstance Mocked logger instance
 * @return {void}
 */
function setLogger(loggerInstance) {
  logger = loggerInstance;
}

module.exports = {
  mw: accessLogger,
  _setLogger: setLogger
};

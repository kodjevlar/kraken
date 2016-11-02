'use strict';
const timing = require('../lib/timing');

/**
 * Sets the response time to the context
 * @param {Object} ctx    Koa context
 * @param {Function} next Next middleware
 */
async function responseTime(ctx, next) {
  const start = process.hrtime();
  await next();
  ctx.state.responseTime = timing.hrtimeToMs(process.hrtime(start));
}

module.exports = {
  mw: responseTime
};

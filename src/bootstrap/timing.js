'use strict';
const logger = require('../lib/logging');
const timing = require('../lib/timing');

/**
 * Bootstrap timing
 */

/**
 * Report handler for timing checks
 * @param {Integer} level      The severity
 * @param {String}  name       Name of the timed event
 * @param {Integer} actual     The actual measured time of the action
 * @param {Object}  assertions The assertions made when measuring
 * @return {void}
 */
function handleTimingReport(level, name, actual, assertions) {
  const message = `Timing: Action '${name}' took ${actual}ms to complete. ` +
    `Expected to be below ${assertions.info}ms`;

  if (level === timing.levels.info) {
    return logger.info(message, assertions);
  }

  return logger.warn(message, assertions);
}

timing.report(handleTimingReport);

// For testing purposes
module.exports = {
  _handleTimingReport: handleTimingReport
};

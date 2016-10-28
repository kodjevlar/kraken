'use strict';

/**
 * Runtime profiling
 */

/**
 * Levels of reporting
 * @type {Object}
 */
const levels = {
  warn: 1,
  info: 2,
  debug: 3
};

/**
 * Runtime settings
 * @type {Object}
 */
const settings = {
  reportHandler: null,
  currentLevel: levels.warn
};

/**
 * Handles the reporting when a check 'fails'
 * @param {Function} callback            Callback function to handle the report
 * @param {Integer}  [level=levels.warn] Minimum level to report on
 */
function report(callback, level = levels.warn) {
  if (typeof callback !== 'function') {
    throw new TypeError('First argument must be a function');
  }

  settings.reportHandler = callback;
  settings.currentLevel = level;
}

/**
 * Converts result of process.hrtime() in milliseconds
 * @param {Array}  hrResult The result to convert
 * @return {Float}          Result as milliseconds
 */
function hrtimeToMs(hrResult) {
  return (hrResult[0] * 1000) + (hrResult[1] / 1e6);
}

/**
 * Creates a new check
 * @param {String}  action         Name of the action to measure
 * @param {Integer} infoThreshold  Millisecond threshold to emit info
 * @param {Integer} warnThreshold  Millisecond threshold to emit warning
 */
function Check(action, infoThreshold, warnThreshold) {
  if (infoThreshold > warnThreshold) {
    throw new TypeError('Warning threshold cannot be higher than error');
  }

  this.action = action;
  this.infoThreshold = infoThreshold;
  this.warnThreshold = warnThreshold;
  this.startingTime = process.hrtime();
}

/**
 * Evaluates the timing result and emits info to the report handler when
 * criterias are met
 * @return {void}
 */
Check.prototype.stop = function() {
  const diff = hrtimeToMs(process.hrtime(this.startingTime));
  const assertions = {
    info: this.infoThreshold,
    warn: this.warnThreshold
  };

  // Always report if debug level
  if (settings.currentLevel === levels.debug) {
    return settings.reportHandler(levels.debug, this.action, diff, assertions);
  }

  if (diff < this.infoThreshold) {
    return;
  }

  const reportLevel = diff < this.warnThreshold ? levels.info : levels.warn;

  return settings.reportHandler(reportLevel, this.action, diff, assertions);
};

module.exports = {
  report: report,
  levels: levels,
  Check: Check,
  _settings: settings,
  _hrtimeToMs: hrtimeToMs
};

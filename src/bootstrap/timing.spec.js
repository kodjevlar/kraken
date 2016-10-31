const sinon = require('sinon');

const timing = require('../lib/timing');
const logger = require('../lib/logging');
const timingBootstrap = require('./timing');

describe('Timing bootstrap', function() {
  describe('Handle timing report', function() {
    it('should log to loggers info level', function() {
      const logMock = sinon.mock(logger);

      logMock.expects('info').once();
      timingBootstrap._handleTimingReport(
        timing.levels.info,
        'Some name',
        12,
        { info: 20 }
      );
      logMock.verify();
    });

    it('should log to loggers warn level', function() {
      const logMock = sinon.mock(logger);

      logMock.expects('warn').once();
      timingBootstrap._handleTimingReport(
        timing.levels.warn,
        'Some name',
        12,
        { info: 20 }
      );
      logMock.verify();
    });

    it('should log a descriptive message', function() {
      const logMock = sinon.mock(logger);
      const expectedMsg = `Timing: Action 'Some name' took 12ms to complete. ` +
        `Expected to be below 20ms`;

      logMock.expects('warn').once().withArgs(expectedMsg, { info: 20 });
      timingBootstrap._handleTimingReport(
        timing.levels.warn,
        'Some name',
        12,
        { info: 20 }
      );
      logMock.verify();
    });
  });
});

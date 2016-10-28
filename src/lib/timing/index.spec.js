const chai = require('chai');
const expect = chai.expect;

const Timing = require('./index');

describe('Profiling', function() {
  describe('Report', function() {
    it('should set callback function', function() {
      const someCallback = function() {};
      Timing.report(someCallback);
      expect(Timing._settings.reportHandler).to.equal(someCallback);
    });

    it('should set report level', function() {
      const somelevel = 99;
      Timing.report(function() {}, somelevel);
      expect(Timing._settings.currentLevel).to.equal(somelevel);
    });
  });

  describe('hrtimeToMs', function() {
    it('should return a float', function(done) {
      const start = process.hrtime();

      setTimeout(function() {
        const actual = Timing._hrtimeToMs(process.hrtime(start));
        // Depending on the speed of the test environment
        expect(actual).to.be.above(5);
        expect(actual).to.be.below(15);
        done();
      }, 10);
    });
  });

  describe('Check', function() {
    it('should throw if error threshold is set lower than warn', function() {
      expect(function() {
        new Timing.Check('Do stuff', 10, 5);
      }).to.throw(TypeError);
    });

    it('should always report on debug level', function(done) {
      Timing.report(function() {
        done();
      }, Timing.levels.debug);

      const check = new Timing.Check('some check', 100000, 100000);
      check.stop();
    });

    it('should emit info if above threshold', function(done) {
      Timing.report(function(level, actionName, actual, assertions) {
        expect(level).to.equal(Timing.levels.info);
        done();
      });

      const check = new Timing.Check('some check', 0, 1000);
      check.stop();
    });

    it('should emit warning if above threshold', function(done) {
      Timing.report(function(level, actionName, actual, assertions) {
        expect(level).to.equal(Timing.levels.warn);
        done();
      });

      const check = new Timing.Check('some check', -1, 0);
      check.stop();
    });

    it('should emit info about timing', function(done) {
      Timing.report(function(level, actionName, actual, assertions) {
        expect(level).to.equal(Timing.levels.warn);
        expect(actionName).to.equal('some check');
        expect(actual).to.be.above(-1);
        expect(actual).to.be.below(3);
        expect(assertions).to.deep.equal({
          info: -1,
          warn: 0
        });
        done();
      });

      const check = new Timing.Check('some check', -1, 0);
      check.stop();
    });
  });
});

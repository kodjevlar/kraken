const chai = require('chai');
const expect = chai.expect;

process.env.LOG_DIR = '/dev/null';
const logger = require('./index');

describe('Logger', function() {
  it('should export a logger instance', function() {
    expect(typeof logger.info).to.equal('function');
  });
});

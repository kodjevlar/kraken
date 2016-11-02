const chai = require('chai');
const expect = chai.expect;

const accessLogger = require('./access-log');

describe('Access log middleware', function() {
  let ctx;

  beforeEach(function() {
    ctx = {
      req: {
        headers: {
          'user-agent': 'chrome'
        },
        url: 'http://localhost'
      },
      res: {
        statusCode: 200
      },
      ip: '127.0.0.1',
      state: {
        responseTime: 2
      }
    };
  });

  it('should log to winston logger', function(done) {
    const logger = {
      info: function(msg) {
        expect(msg).to.equal('127.0.0.1 2ms "http://localhost" 200 "chrome"');
        done();
      }
    };

    accessLogger._setLogger(logger);

    accessLogger.mw(ctx, function() {
      return;
    });
  });

   it('should output unknown user agent', function(done) {
    const logger = {
      info: function(msg) {
        expect(msg).to.equal('127.0.0.1 2ms "http://localhost" 200 "unknown"');
        done();
      }
    };

    delete ctx.req.headers['user-agent'];
    accessLogger._setLogger(logger);

    accessLogger.mw(ctx, function() {
      return;
    });
  });
});

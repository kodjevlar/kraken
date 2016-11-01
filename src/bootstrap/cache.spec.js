const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const logger = require('../lib/logging');

process.env.SYSTEM_LOG = '/dev/null';
const cache = require('./cache');

describe('Cache bootstrap', function() {
  it('should emit Redis errors to logger', function() {
    const logMock = sinon.mock(logger);

    logMock.expects('error').once();
    cache._handleRedisError(new Error('some error'));
    logMock.verify();
  });

  it('should log if cache is disabled', function() {
    const logMock = sinon.mock(logger);

    logMock.expects('warn').once();
    cache._notifyCacheDisabled();
    logMock.verify();
  });

  it('should not log if cache is enabled', function() {
    const logMock = sinon.mock(logger);

    process.env.CACHE_ENABLED = '1';
    logMock.expects('warn').never();
    cache._notifyCacheDisabled();
    logMock.verify();
    process.env.CACHE_ENABLED = '0';
  });

  describe('readthroughRead', function() {
    it('should return a promise', function() {
      const result = cache._readthroughRead(true);

      expect(result instanceof Promise).to.be.true;
    });

    it('should reject promise on read error', function(done) {
      const redisClientStub = sinon.stub(cache._redisClient, 'get');

      redisClientStub.yields(new Error('some error'), null);

      cache._readthroughRead('').catch(function(err) {
        expect(err.message).to.equal('some error');
        redisClientStub.restore();
        done();
      });
    });

    it('should resolve undefined if cache answered with null', function() {
      const redisClientStub = sinon.stub(cache._redisClient, 'get');

      redisClientStub.yields(null, null);

      return cache._readthroughRead('').then(function(data) {
        expect(data).to.equal(undefined);
        redisClientStub.restore();
      });
    });

    it('should resolve data if cache answered with data', function() {
      const mockData = { some: 'data' };
      const redisClientStub = sinon.stub(cache._redisClient, 'get');

      redisClientStub.yields(null, mockData);

      return cache._readthroughRead('').then(function(data) {
        expect(data).to.deep.equal(mockData);
        redisClientStub.restore();
      });
    });
  });

  describe('readthroughWrite', function() {
    it('should return a promise with result', function() {
      const redisClientStub = sinon.stub(cache._redisClient, 'setex');

      redisClientStub.yields(null, 'data');
      const result = cache._readthroughWrite('key', 'data', 100);

      return result.then(function(data) {
        expect(data).to.equal('data');
        expect(result instanceof Promise).to.be.true;
        redisClientStub.restore();
      });
    });

    it('should reject promise if write failed', function(done) {
      const redisClientStub = sinon.stub(cache._redisClient, 'setex');

      redisClientStub.yields(new Error('some error'), null);

      cache._readthroughWrite('key', 'data', 100).catch(function(err) {
        expect(err.message).to.equal('some error');
        redisClientStub.restore();
        done();
      });
    });
  });
});

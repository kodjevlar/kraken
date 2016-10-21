const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const Cache = require('./index');

describe('Cache', function() {
  describe('Construct cache key', function() {
    it('should generate a string', function() {
      const expected = 'entity_customer_id_1_';
      const actual = Cache.constructCacheKey('customer', { id: 1 });
      expect(actual).to.equal(expected);
    });

    it('should create the same key for different order of identifier keys', function() {
      const expected = 'entity_customer_id_1_name_test_';
      const actual1 = Cache.constructCacheKey('customer', {
        id: 1,
        name: 'test'
      });

      const actual2 = Cache.constructCacheKey('customer', {
        name: 'test',
        id: 1
      });

      expect(actual1).to.equal(expected);
      expect(actual1).to.equal(actual2);
    });
  });

  describe('Setup', function() {
    it('should set a cache engine instance', function() {
      Cache.setup('obj');
      expect(Cache.client).to.equal('obj');
    });

    after(function() {
      Cache.client = null;
    });
  });

  describe('Get', function() {
    beforeEach(function() {
      Cache.client = null;
    });

    it('should reject promise if cache engine throws', function(done) {
      Cache.client = {
        get: function(key, callback) {
          return callback(new Error('Some error'));
        }
      };

      Cache.get('somekey').catch(function(err) {
        expect(err.message).to.equal('Some error');
        done();
      });
    });

    it('should resolve data if no errors', function(done) {
      Cache.client = {
        get: function(key, callback) {
          return callback(null, '{"id":1}');
        }
      };

      Cache.get('somekey').then(function(data) {
        expect(typeof data.found).to.equal('boolean');
        expect(typeof data.data).to.equal('object');
        expect(data.data).to.deep.equal({ id: 1 });
        expect(data.found).to.equal(true);
        done();
      });
    });
  });

  describe('Read trough', function() {
    afterEach(function() {
      Cache.client = null;
    });

    it('should return a promise', function() {
      const actual = Cache.readthrough('customer', { id: 1 }, 3600, function() {

      });

      expect(actual instanceof Promise).to.equal(true);
    });

    it('should fetch data from callback if no data in cache', function(done) {
      const stub = sinon.stub(Cache, 'get');
      stub.returns(Promise.resolve({
        found: false,
        data: null
      }));

      Cache.client = {
        setex: function(key, ttl, data, cb) {}
      };

      Cache.readthrough('customer', { id: 1 }, 3600, function() {
        done();
        stub.restore();
        return 'fresh data';
      });
    });

    it('should not fetch data from callback if found in cache', function() {
      const stub = sinon.stub(Cache, 'get');
      stub.returns(Promise.resolve({
        found: true,
        data: 'cached data'
      }));

      const spy = sinon.spy();

      return Cache.readthrough('customer', { id: 1 }, 3600, spy)
        .then(function(data) {
          expect(spy.callCount).to.equal(0);
          expect(data).to.equal('cached data');
          stub.restore();
        });
    });

    it('should add data to cache engine', function(done) {
      const getStub = sinon.stub(Cache, 'get');
      getStub.returns(Promise.resolve({
        found: false,
        data: null
      }));

      const fetchCallback = function() {
        return { id: 1 };
      };

      Cache.client = {
        setex: function(key, ttl, data, cb) {
          expect(key).to.equal('entity_customer_id_1_');
          expect(ttl).to.equal(3600);
          expect(data).to.equal('{"id":1}');
          getStub.restore();
          done();
        }
      };

      Cache.readthrough('customer', { id: 1 }, 3600, fetchCallback);
    });
  });
});

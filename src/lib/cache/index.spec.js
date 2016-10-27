const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const Cache = require('./index');

describe('Cache', function() {
  describe('Setup', function() {
    it('should throw error if read setting is not a function', function() {
      expect(function() {
        Cache.setup({
          write: function() { }
        });
      }).to.throw(TypeError);
    });

    it('should throw error if write setting is not a function', function() {
      expect(function() {
        Cache.setup({
          read: function() { }
        });
      }).to.throw(TypeError);
    });

    it('should set the enabled flag', function() {
      Cache.setup({
        read: function() {},
        write: function() {},
        enabled: false
      });

      expect(Cache._settings.enabled).to.be.false;
    });
  });

  describe('Construct cache key', function() {
    beforeEach(function() {
      Cache.setup({
        write: function() {},
        read: function() {}
      });
    });

    it('should generate a string', function() {
      const expected = 'entity_customer_id_1_';
      const actual = Cache._constructCacheKey('customer', { id: 1 });
      expect(actual).to.equal(expected);
    });

    it('should create the same key for different order of identifier keys', function() {
      const expected = 'entity_customer_id_1_name_test_';
      const actual1 = Cache._constructCacheKey('customer', {
        id: 1,
        name: 'test'
      });

      const actual2 = Cache._constructCacheKey('customer', {
        name: 'test',
        id: 1
      });

      expect(actual1).to.equal(expected);
      expect(actual1).to.equal(actual2);
    });
  });

  describe('Read trough', function() {
    it('should return a promise', function() {
      Cache.setup({
        read: function(key) {
          return Promise.resolve('asd');
        },
        write: function() { }
      });

      const actual = Cache.readthrough('customer', { id: 1 }, 3600, function() {

      });

      expect(actual instanceof Promise).to.equal(true);
    });

    it('should fetch data from callback if no data in cache', function(done) {
      Cache.setup({
        read: function() {
          return Promise.resolve(undefined);
        },
        write: function() {
          return Promise.resolve();
        }
      });

      Cache.readthrough('customer', { id: 1 }, 3600, function() {
        return 'Some data';
      }).then(function(data) {
        expect(data).to.equal('Some data');
        done();
      });
    });

    it('should not fetch data from callback if found in cache', function() {
      Cache.setup({
        read: function() {
          return Promise.resolve(JSON.stringify('data'));
        },
        write: function() {}
      });

      const spy = sinon.spy();

      return Cache.readthrough('customer', { id: 1 }, 3600, spy).then(function(data) {
        expect(data).to.equal('data');
        expect(spy.callCount).to.equal(0);
      });
    });

    it('should call the write callback when data has been resolved', function(done) {
      Cache.setup({
        read: function() {
          return Promise.resolve();
        },
        write: function(key, data, ttl) {
          expect(key).to.equal('entity_customer_id_1_');
          expect(data).to.equal(JSON.stringify('some data'));
          expect(ttl).to.equal(3600);
          done();
        }
      });

      Cache.readthrough('customer', { id: 1 }, 3600, function() {
        return 'some data';
      });
    });

    it('should not read from cache when cache is disabled', function(done) {
      const spy = sinon.spy();

      Cache.setup({
        read: spy,
        write: spy,
        enabled: false
      });

      Cache.readthrough('customer', { id: 1 }, 3600, function() {
        expect(spy.callCount).to.equal(0);
        done();
      });
    });
  });
});

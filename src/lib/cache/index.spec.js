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

  describe('Read trough', function() {
    it('should return a promise', function() {
      const actual = Cache.readthrough('customer', { id: 1 }, 3600, function() {

      });

      expect(actual instanceof Promise).to.equal(true);
    });

    it('should fetch data from callback if no data in cache', function() {
      const stub = sinon.stub(Cache, 'get');
      stub.returns(Promise.resolve({
        found: false,
        data: ''
      }));

      return Cache.readthrough('customer', { id: 1 }, 3600, function() {
        return 'fresh data';
      })
        .then(function(data) {
          expect(data).to.equal('fresh data');
          stub.restore();
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

    it('should send errors via the error event', function(done) {
      const getStub = sinon.stub(Cache, 'get');
      getStub.returns(Promise.resolve({
        found: false,
        data: null
      }));

      const addStub = sinon.stub(Cache, 'add');
      addStub.returns(Promise.reject(new Error('some error')));

      Cache.on('error', function(err) {
        expect(err.message).to.equal('some error');
        done();
      });

      Cache.readthrough('customer', { id: 1 }, 3600, function() {
        return null;
      })
        .then(function(data) {
          expect(data).to.equal(null);
          getStub.restore();
          addStub.restore();
        });
    });

    it('should add data to cache engine', function() {
      const getStub = sinon.stub(Cache, 'get');
      getStub.returns(Promise.resolve({
        found: false,
        data: null
      }));

      const addMock = sinon.mock(Cache);
      const expectation = addMock
        .expects('add')
        .withArgs('entity_customer_id_1_', 'data', 3600)
        .returns(Promise.resolve());

      return Cache.readthrough('customer', { id: 1 }, 3600, function() {
        return 'data';
      })
        .then(function(data) {
          console.log('asdasdasd');
          expectation.verify();
          getStub.restore();
        });
    });
  });
});

const chai = require('chai');
const expect = chai.expect;

const Resolver = require('./index');

describe('Resolver', function() {
  it('should export resolver prototype', function() {
    expect(typeof Resolver.prototype).to.equal('object');
  });
});

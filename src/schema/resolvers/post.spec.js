const chai = require('chai');
const expect = chai.expect;

const postResolvers = require('./post');

describe('Post resolvers', function() {
  describe('getPosts', function() {
    it('should return a promise', function() {
      expect(postResolvers.getPosts() instanceof Promise).to.be.true;
    });
  });
});

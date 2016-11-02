const chai = require('chai');
const expect = chai.expect;

const postMutations = require('./post');

describe('Post mutations', function() {
  describe('createPost', function() {
    it('should return a promise', function() {
      expect(postMutations.createPost() instanceof Promise).to.be.true;
    });
  });
});

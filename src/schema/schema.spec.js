const chai = require('chai');
const expect = chai.expect;

const gql = require('graphql');
const schema = require('./schema');

describe('Root schema', function() {
  it('should be of correct type', function() {
    expect(schema instanceof gql.GraphQLSchema).to.be.true;
  });
});

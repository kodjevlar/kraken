'use strict';
const gql = require('graphql');

const DisplayProductInterface = require('../../interfaces/displayproduct');

const Variable = new gql.GraphQLObjectType({
  name: 'Variable',
  interfaces: (function() {
    return [DisplayProductInterface];
  })(),
  fields: {
    name: {
      type: gql.GraphQLString
    },
    price: {
      type: gql.GraphQLFloat
    }
  }
});

module.exports = Variable;

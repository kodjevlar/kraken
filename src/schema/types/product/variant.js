'use strict';
const gql = require('graphql');

const DisplayProductInterface = require('../../interfaces/displayproduct');

const Variant = new gql.GraphQLObjectType({
  name: 'Variant',
  interfaces: (function() {
    return [DisplayProductInterface];
  })(),
  fields: {
    name: {
      type: gql.GraphQLString
    },
    sku: {
      type: gql.GraphQLString
    },
    price: {
      type: gql.GraphQLFloat
    }
  }
});

module.exports = Variant;

'use strict';
const gql = require('graphql');

const DisplayProductInterface = require('../../interfaces/displayproduct');

const Bundle = new gql.GraphQLObjectType({
  name: 'Bundle',
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

module.exports = Bundle;

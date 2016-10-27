'use strict';
const gql = require('graphql');

const SimpleProduct = new gql.GraphQLObjectType({
  name: 'SimpleProduct',
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

module.exports = SimpleProduct;

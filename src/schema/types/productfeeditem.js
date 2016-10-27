'use strict';
const gql = require('graphql');

const SimpleProduct = require('../types/simpleproduct');

const ProductFeedItem = new gql.GraphQLObjectType({
  name: 'ProductFeeditem',
  fields: {
    createdAt: {
      type: gql.GraphQLString
    },
    updatedAt: {
      type: gql.GraphQLString
    },
    name: {
      type: gql.GraphQLString
    },
    product: {
      type: SimpleProduct
    }
  }
});

module.exports = ProductFeedItem;

'use strict';
const gql = require('graphql');

const DisplayProductInterface = require('../../interfaces/displayproduct');

const FeeditemProduct = new gql.GraphQLObjectType({
  name: 'FeeditemProduct',
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
      type: new gql.GraphQLObjectType({
        name: 'DisplayProduct',
        interfaces: (function() {
          return [DisplayProductInterface];
        })(),
        fields: {
          name: { type: gql.GraphQLString },
          price: { type: gql.GraphQLFloat }
        }
      })
    }
  }
});

module.exports = FeeditemProduct;

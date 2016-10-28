'use strict';
const gql = require('graphql');

/**
 * https://medium.com/the-graphqlhub/graphql-tour-interfaces-and-unions-7dd5be35de0d#.s507kj1ay
 */

// Types
const FeeditemPost = require('./types/feeditem/post');
const FeeditemProduct = require('./types/feeditem/product');

// Unions
const FeeditemType = require('./unions/feeditem');

// Resolvers
const FeeditemResolvers = require('./resolvers/feeditem');

// Interfaces
const DisplayProductInterface = require('./interfaces/displayproduct');

const schema = new gql.GraphQLSchema({
  types: (function() {
    return [DisplayProductInterface];
  })(),
  query: new gql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      feeditems: {
        type: new gql.GraphQLList(FeeditemType),
        resolve: FeeditemResolvers.getItems,
        args: {
          createdAt: {
            type: gql.GraphQLString
          }
        }
      }
    }
  })
});

module.exports = schema;

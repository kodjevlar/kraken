'use strict';
const gql = require('graphql');

/**
 * https://medium.com/the-graphqlhub/graphql-tour-interfaces-and-unions-7dd5be35de0d#.s507kj1ay
 */

// Types
const PostFeeditem = require('./types/postfeeditem');
const ProductFeeditem = require('./types/productfeeditem');
const SimpleProduct = require('./types/simpleproduct');

// Unions
const FeeditemType = require('./unions/feeditem');

// Resolvers
const FeeditemResolvers = require('./resolvers/feeditem');

const schema = new gql.GraphQLSchema({
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

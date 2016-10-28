'use strict';
const gql = require('graphql');

const FeeditemPost = new gql.GraphQLObjectType({
  name: 'FeeditemPost',
  fields: {
    createdAt: {
      type: gql.GraphQLString
    },
    updatedAt: {
      type: gql.GraphQLString
    },
    name: {
      type: gql.GraphQLString
    }
  }
});

module.exports = FeeditemPost;

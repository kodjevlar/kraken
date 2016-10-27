'use strict';
const gql = require('graphql');

const PostFeeditem = new gql.GraphQLObjectType({
  name: 'PostFeeditem',
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

module.exports = PostFeeditem;

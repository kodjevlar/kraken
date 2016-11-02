'use strict';
const gql = require('graphql');

const PostOutputType = new gql.GraphQLObjectType({
  name: 'PostOutputType',
  fields: {
    title: {
      type: gql.GraphQLString
    },
    content: {
      type: gql.GraphQLString
    }
  }
});

const PostInputType = new gql.GraphQLInputObjectType({
  name: 'PostInputType',
  fields: {
    title: {
      type: gql.GraphQLString
    },
    content: {
      type: gql.GraphQLString
    }
  }
});

module.exports = {
  output: PostOutputType,
  input: PostInputType
};

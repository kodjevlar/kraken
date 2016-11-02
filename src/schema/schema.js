'use strict';
const gql = require('graphql');

// Types
const postType = require('./types/post/post');

// Resolvers
const postResolvers = require('./resolvers/post');

// Mutations
const postMutations = require('./mutations/post');

const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      posts: {
        type: new gql.GraphQLList(postType.output),
        resolve: postResolvers.getPosts,
        args: {
          createdAt: {
            type: gql.GraphQLString
          }
        }
      }
    }
  }),
  mutation: new gql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createPost: {
        type: postType.output,
        args: postType.input._typeConfig.fields,
        resolve: postMutations.createPost
      }
    }
  })
});

module.exports = schema;

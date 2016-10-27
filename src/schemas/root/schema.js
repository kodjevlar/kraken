'use strict';

const gql = require('graphql');

const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      test: {
        type: gql.GraphQLString
      }
    }
  })
});

module.exports = schema;

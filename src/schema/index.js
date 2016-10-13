'use strict';

const gql = require('graphql');

const customer = require('./types/customer');

const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      customers: {
        type: new gql.GraphQLList(customer),
      },
    }
  })
});

module.exports = schema;

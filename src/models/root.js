'use strict';

const gql = require('graphql');

const customer = require('./customer');

const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      customer: {
        type: customer.schema,
        args: {
          id: {
            type: gql.GraphQLInt
          }
        },
        resolve: customer.resolvers.getCustomer
      }
    }
  })
});

module.exports = schema;

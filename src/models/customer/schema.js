'use strict';

const gql = require('graphql');
const resolvers = require('./resolvers');

const customer = new gql.GraphQLObjectType({
  name: 'Customer',
  fields: {
    firstname: {
      type: gql.GraphQLString,
      description: 'Firstname of the customer',
      resolve: resolvers.firstname
    },
    lastname: {
      type: gql.GraphQLString,
      description: 'Lastname of the customer',
      resolve: resolvers.lastname
    },
    id: {
      type: gql.GraphQLInt,
      description: 'ID of the customer',
      resolve: resolvers.id
    }
  },
  query: {
    id: {
      type: gql.GraphQLInt
    }
  },
  resolve: resolvers.getCustomer
});

module.exports = customer;

'use strict';

const gql = require('graphql');

const customer = new gql.GraphQLObjectType({
  name: 'Customer',
  fields: {
    firstname: {
      type: gql.GraphQLString,
      description: 'Firstname of the customer',
      resolve() {
        return 'Test';
      }
    },
    lastname: {
      type: gql.GraphQLString,
      description: 'Lastname of the customer',
      resolve() {
        return 'Testsson';
      }
    }
  }
});

module.exports = customer;

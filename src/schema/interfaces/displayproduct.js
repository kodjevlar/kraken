'use strict';
const gql = require('graphql');

const Variant = require('../types/product/variant');
const Variable = require('../types/product/variable');
const Bundle = require('../types/product/bundle');

const DisplayProductInterface = new gql.GraphQLInterfaceType({
  name: 'DisplayProductInterface',
  fields: {
    name: {
      type: gql.GraphQLString
    },
    price: {
      type: gql.GraphQLFloat
    }
  },
  resolveType: function(data) {
    if ('product' in data) {
      return Variant;
    }
  }
});

module.exports = DisplayProductInterface;

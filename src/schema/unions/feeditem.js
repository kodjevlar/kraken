'use strict';
const gql = require('graphql');

const FeedItemProduct = require('../types/feeditem/product');
const FeeditemPost = require('../types/feeditem/post');

const FeeditemType = new gql.GraphQLUnionType({
  name: 'Feeditem',
  types: [
    FeedItemProduct,
    FeeditemPost
  ],
  resolveType(feeditem) {
    if (feeditem.type === 'product') {
      return FeedItemProduct;
    }

    if (feeditem.type === 'post') {
      return FeeditemPost;
    }
  }
});

module.exports = FeeditemType;

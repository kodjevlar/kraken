'use strict';
const gql = require('graphql');

const ProductFeeditem = require('../types/productfeeditem');
const PostFeeditem = require('../types/postfeeditem');

const FeeditemType = new gql.GraphQLUnionType({
  name: 'Feeditem',
  types: [
    ProductFeeditem,
    PostFeeditem
  ],
  resolveType(feeditem) {
    if (feeditem.type === 'product') {
      return ProductFeeditem;
    }

    if (feeditem.type === 'post') {
      return PostFeeditem;
    }
  }
});

module.exports = FeeditemType;

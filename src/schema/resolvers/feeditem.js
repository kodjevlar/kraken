'use strict';

/**
 * Gets feed items
 * @param {Object} args Parameters passed from query
 */
function getItems(parent, args) {
  return [
    {
      type: 'product',
      name: 'Some product post',
      createdAt: '2016',
      updatedAt: '2016',
      product: {
        name: 'Some product name',
        price: 199,
        sku: 'asdasd'
      }
    },
    {
      type: 'post',
      name: 'Some post',
      createdAt: '2017',
      updatedAt: '2017'
    },
    {
      type: 'post',
      name: 'Some post',
      createdAt: '2017',
      updatedAt: '2017'
    },
    {
      type: 'post',
      name: 'Some post',
      createdAt: '2017',
      updatedAt: '2017'
    }
  ].filter(function(feeditem) {
    if ('createdAt' in args) {
      return feeditem.createdAt === args.createdAt;
    }

    return true;
  });
}

module.exports = {
  getItems: getItems
};

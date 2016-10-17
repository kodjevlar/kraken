/**
 * Defines resolvers for customer entity
 */
const Resolver = require('../../lib/resolver/index');
const Cache = require('../../lib/cache');
const ENTITY_KEY = 'customer';

// Plain resolver
function firstname(customer) {
  return customer.firstname;
}

// Plain resolver
function lastname(customer) {
  return customer.lastname;
}

// Plain resolver
function id(customer) {
  return customer.id;
}

// NON-plain resolver
function getCustomer(parent, args) {
  return Cache.readthrough(ENTITY_KEY, args, 3600, function() {
    if ('id' in args) {
      return {
        firstname: 'Johan',
        lastname: 'Canefur',
        id: 1337
      };
    }

    return new Error('No filter applied?');
  });
}

/**
 * Export resolvers
 * @type {Object}
 */
module.exports = {
  firstname: firstname,
  lastname: lastname,
  getCustomer: getCustomer
};

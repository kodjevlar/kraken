'use strict';

/**
 * Read through cache implementation with Redis
 *
 * Features:
 *  - Read through cache
 */

const self = module.exports = {
  /**
   * Redis client
   * @type {RedisClient}
   */
  client: null,

  /**
   * Sets the redis cache engine
   * @param  {RedisClient} client Redis client
   * @return {void}
   */
  setup: function(client) {
    self.client = client;
  },

  /**
   * Constructs a cache key for data
   * @param  {string} entity     Name of the entity
   * @param  {Object} identifier Object that identifies the data
   * @return {string}            Constructed cache key
   */
  constructCacheKey: function(entity, identifier) {
    // Sort the keys if there are more than 1, to eliminiate duplicate keys
    if (Object.keys(identifier).length > 1) {
      const sortedKeys = Object.keys(identifier).sort();
      const sortedIdentifier = {};

      for (const key of sortedKeys) {
        sortedIdentifier[key] = identifier[key];
      }

      identifier = sortedIdentifier;
    }

    // Create a key from JSON
    return 'entity_' + entity + JSON.stringify(identifier)
      .replace(/[\W_]+/g, '_');
  },

  /**
   * Fetches data from cache
   * @todo This can be made in faster way. Promises are pretty slow atm.
   * @param  {string} key Cache key to load from
   * @return {Promise}    Data object
   */
  get: function(key) {
    return new Promise(function(resolve, reject) {
      self.client.get(key, function(err, data) {
        if (err) {
          return reject(err);
        }

        return resolve({
          found: !(data === null),
          data: JSON.parse(data)
        });
      });
    });
  },

  /**
   * Read through helper function
   * @param  {string}   entity     Name of the entity to get
   * @param  {object}   identifier Object that identifies the data
   * @param  {int}      ttl        Time-to-live for the object (seconds)
   * @param  {Function} callback   Callback that collects data if it doesnt
   *                               exists
   *                               in cache. Should return a Promise
   * @return {Promise}             Resolves the gathered data
   */
  readthrough: function(entity, identifier, ttl, callback) {
    const key = self.constructCacheKey(entity, identifier);

    return self.get(key).then(function(data) {
      // Early return if the data existed in cache
      if (data.found) {
        return data.data;
      }

      // Run the callback to get the data
      let result = callback();

      // Wrap scalar values in promise
      if (!(result instanceof Promise)) {
        result = Promise.resolve(result);
      }

      return result.then(function(data) {
        self.client.setex(key, ttl, JSON.stringify(data));
        return data;
      });
    });
  }
};

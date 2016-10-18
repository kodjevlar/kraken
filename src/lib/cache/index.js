/**
 * Read through cache implementation with Redis
 *
 * Features:
 *  - Read through cache
 *
 * Canveats:
 *  - Caching is performed asynchronously after data is returned, so errors in
 *    the caching will not reject the promise. Listen on errors with
 *    on('error', cb) instead
 */

const self = module.exports = {
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
   * @param  {string} key Cache key to load from
   * @return {Promise}    Data object
   */
  get: function(key) {
    return Promise.resolve(); // TODO: implement this
  },

  /**
   * Adds an entry to the cache
   * @param {string} key        Key to store the entry by
   * @param {mixed}  data       Data to store
   * @param {Number} [ttl=3600] Time to live for the entry
   * @return {Promise} Result from add
   */
  add: function(key, data, ttl = 3600) {
    return Promise.resolve(); // TODO: implement this
  },

  /**
   * Read through helper function
   * @param  {string}   entity     Name of the entity to get
   * @param  {object}   identifier Object that identifies the data
   * @param  {int}      ttl        Time-to-live for the object
   * @param  {Function} callback   Callback that collects data if it doesnt
   *                               exists
   *                               in cache. Should return a Promise
   * @return {Promise}             Resolves the gathered data
   */
  readthrough: function(entity, identifier, ttl, callback) {
    const cacheKey = self.constructCacheKey(entity, identifier);

    return self.get(cacheKey).then(function(data) {
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
        // Cache async
        self.add(cacheKey, data, ttl).catch(function(err) {
          self.onError(err);
        });

        return data;
      });
    });
  },

  /**
   * Collection of event handlers (callbacks)
   * @type {Object}
   */
  eventHandlers: {},

  /**
   * Event subscriber
   * @param  {string} eventName Name of the event
   * @param  {Function} callback Callback function to run on event
   * @return {void}
   */
  on: function(eventName, callback) {
    if (eventName === 'error') {
      self.eventHandlers.error = callback;
    }
  },

  /**
   * Sends error event to the provided event handler
   * @param  {Error} err Error object to send
   * @return {void}
   */
  onError: function(err) {
    if (typeof self.eventHandlers.error === 'function') {
      self.eventHandlers.error(err);
      return;
    }

    // No event handler, or invalid event handler provided
  }
};

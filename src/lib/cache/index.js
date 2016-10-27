'use strict';

/**
 * Contains the readthrough configuration
 * @type {Object}
 */
const settings = {};

/**
 * Read through cache implementation
 * @param {Object} config Config object
 */
function setup(config) {
  if (typeof config.write !== 'function') {
    throw new TypeError('write property must be a function');
  }

  if (typeof config.read !== 'function') {
    throw new TypeError('read property must be a function');
  }

  settings.read = config.read;
  settings.write = config.write;
  settings.enabled = 'enabled' in config ? config.enabled : true;
}

/**
 * Constructs a cache key for data
 * @param  {string} entity     Name of the entity
 * @param  {Object} identifier Object that identifies the data
 * @return {string}            Constructed cache key
 */
function constructCacheKey(entity, identifier) {
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
}

/**
 * Wraps the user specified callback in a promise
 * @param {Function} callback Callback function
 * @return {Promise}          Wrapped promise if needed
 */
function getUserDataSource(callback) {
  let result = callback();

  if (!(result instanceof Promise)) {
    result = Promise.resolve(result);
  }

  return result;
}

/**
 * Readthrough
 * @param {String}   entity     Name of the entity to cache (for generating key)
 * @param {Object}   identifier Object to identify the entry
 * @param {integer}  ttl        Time to live for the entry
 * @param {Function} callback   Function to run when the data wasnt found
 * @return {Promise}            Promise with resolved data
 */
function readthrough(entity, identifier, ttl, callback) {
  if (!settings.enabled) {
    return getUserDataSource(callback);
  }

  const key = constructCacheKey(entity, identifier);
  // Try to get the data from cache
  return settings.read(key).then(function(data) {
    if (!(data === undefined)) {
      return JSON.parse(data);
    }

    return getUserDataSource(callback).then(function resolveResult(data) {
      return settings.write(key, JSON.stringify(data), ttl).then(function() {
        return data;
      });
    });
  });
}

module.exports = {
  setup: setup,
  readthrough: readthrough,
  _constructCacheKey: constructCacheKey,
  _getUserDataSource: getUserDataSource,
  _settings: settings
};

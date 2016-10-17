/**
 * Read through cache implementation with Redis
 */

/**
 * Constructs a cache key for data
 * @param  {string} entity     Name of the entity
 * @param  {Object} identifier Object that identifies the data
 * @return {string}            Constructed cache key
 */
function constructCacheKey(entity, identifier) {
  return 'entity_' + entity + '_' + JSON.stringify(identifier);
}

/**
 * Fetches data from cache
 * @param  {string} key Cache key to load from
 * @return {Promise}    Data on success, null on fail
 */
function fetchFromCache(key) {
  return Promise.resolve(key);
}

/**
 * Read through helper function
 * @param  {string}   entity     Name of the entity to get
 * @param  {object}   identifier Object that identifies the data
 * @param  {int}      ttl        Time-to-live for the object
 * @param  {Function} callback   Callback that collects data if it doesnt exists
 *                               in cache. Should return a Promise
 * @return {Promise}             Resolves the gathered data
 */
function readthrough(entity, identifier, ttl, callback) {
  const cacheKey = constructCacheKey(entity, identifier);

  return fetchFromCache(cacheKey).then(function(data) {
    // Early return if the data existed in cache
    if (!(data === null)) {
      return data;
    }

    // Run the callback to get the data
    let result = callback();

    // Wrap scalar values in promise
    if (!(result instanceof Promise)) {
      result = Promise.resolve(result);
    }

    return result;
  });
}

module.exports = {
  constructCacheKey: constructCacheKey,
  readthrough: readthrough
};

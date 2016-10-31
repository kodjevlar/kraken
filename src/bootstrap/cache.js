'use strict';
const redis = require('redis');
const readthrough = require('readthrough');
const logger = require('../lib/logging');

/**
 * Bootstrap cache
 */

const redisClient = redis.createClient({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT
});

/**
 * Handles errors from redis client
 * @param {Error} err Thrown error
 */
function handleRedisError(err) {
  logger.error('Caching error', err);
}

/**
 * Notifies if cache is disabled
 * @return {void}
 */
function notifyCacheDisabled() {
  if (process.env.CACHE_ENABLED !== '1') {
    logger.warn('Cache is disabled');
  }
}

/**
 * Reads data from cache based on key
 * @param {String} key Entry to read
 * @return {Promise} Promise with gathered data, undefined if not data was
 * found
 */
function readthroughRead(key) {
  return new Promise(function(resolve, reject) {
    redisClient.get(key, function(err, data) {
      if (err) {
        return reject(err);
      }

      return resolve(data === null ? undefined : data);
    });
  });
}

/**
 * Write data to cache
 * @param {String} key Key to write to
 * @param {String} data Data to write
 * @param {Integer} ttl TTL value for the entry
 * @return {Promise} Promise indicating result
 */
function readthroughWrite(key, data, ttl) {
  return new Promise(function(resolve, reject) {
    redisClient.setex(key, ttl, data, function(err, result) {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
}

// Attach a logger to redis error events
redisClient.on('error', handleRedisError);

// Setup readthrough cache to use Redis
readthrough.setup({
  read: readthroughRead,
  write: readthroughWrite,
  enabled: Boolean(process.env.CACHE_ENABLED)
});

// For testing purposes
module.exports = {
  _readthroughWrite: readthroughWrite,
  _readthroughRead: readthroughRead,
  _handleRedisError: handleRedisError,
  _notifyCacheDisabled: notifyCacheDisabled,
  _redisClient: redisClient
};

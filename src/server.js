'use strict';

const logger = require('./lib/logging');
const app = require('express')();
const graphqlHTTP = require('express-graphql');
const RootSchema = require('./schema/schema');
const Redis = require('redis');
const Cache = require('readthrough');
const Timing = require('./lib/timing');

logger.info('Application started in ' + process.env.NODE_ENV + ' mode');

// Setup timing
Timing.report(function handleTimingReport(level, name, actual, assertions) {
  const message = `Profiler: Action '${name}' took ${actual}ms to complete. ` +
    `Expected to be below ${assertions.info}ms`;

  if (level === Timing.levels.info) {
    return logger.info(message, assertions);
  }

  return logger.warn(message, assertions);
});

const bootstrapTimer = new Timing.Check('Application bootstrap', 20, 100);

const redisClient = Redis.createClient({
  host: 'cache',
  port: 6379
});

// Attach a logger to redis error events
redisClient.on('error', function(err) {
  logger.error('Caching error', err);
});

// Setup readthrough cache to use Redis
Cache.setup({
  read: function(key) {
    return new Promise(function(resolve, reject) {
      redisClient.get(key, function(err, data) {
        if (err) {
          return reject(err);
        }

        return resolve(data === null ? undefined : data);
      });
    });
  },
  write: function(key, data, ttl) {
    return new Promise(function(resolve, reject) {
      redisClient.setex(key, ttl, data, function(err, result) {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });
  },
  enabled: Boolean(process.env.CACHE_ENABLED)
});

if (!process.env.CACHE_ENABLED) {
  logger.warn('Cache is disabled');
}

app.use(process.env.ENDPOINT, graphqlHTTP({
  schema: RootSchema,
  graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(process.env.PORT, function() {
  bootstrapTimer.stop();
  logger.info(`Serving endpoint at ${process.env.ENDPOINT}`);
});

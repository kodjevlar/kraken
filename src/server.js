'use strict';

const logger = require('./lib/logging');
const app = require('express')();
const graphqlHTTP = require('express-graphql');
const RootSchema = require('./models/root');
const Redis = require('redis');
const Cache = require('./lib/cache');

logger.info('Application started in ' + process.env.NODE_ENV + ' mode');

const cacheClient = Redis.createClient({
  host: 'cache',
  port: 6379
});

// Attach a logger to redis error events
cacheClient.on('error', function(err) {
  logger.error('Caching error', err);
});

Cache.setup(cacheClient);

app.use(process.env.ENDPOINT, graphqlHTTP({
  schema: RootSchema,
  graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(process.env.PORT, function() {
  logger.info(`Serving endpoint at ${process.env.ENDPOINT}`);
});

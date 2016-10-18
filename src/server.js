'use strict';

const logger = require('./lib/logging');
const app = require('express')();
const graphqlHTTP = require('express-graphql');
const RootSchema = require('./models/root');
const Cache = require('./lib/cache');

logger.info('Application started in ' + process.env.NODE_ENV + ' mode');

// Attach a logger to caching events
Cache.on('error', function(err) {
  logger.error('Caching error', err);
});

app.use(process.env.ENDPOINT, graphqlHTTP({
  schema: RootSchema,
  graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(process.env.PORT, function() {
  logger.info(`Serving endpoint at ${process.env.ENDPOINT}`);
});

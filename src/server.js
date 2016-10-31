'use strict';
const logger = require('./lib/logging');
const app = require('express')();
const graphqlHTTP = require('express-graphql');
const timing = require('./lib/timing');
const rootSchema = require('./schema/schema');

logger.info('Application started in ' + process.env.NODE_ENV + ' mode');
const serverTimer = new timing.Check('Starting express server', 20, 100);

// Setup GraphQL
app.use(process.env.ENDPOINT, graphqlHTTP({
  schema: rootSchema,
  graphiql: process.env.NODE_ENV === 'development'
}));

// Start server
app.listen(process.env.PORT, function handleListenFinish() {
  serverTimer.stop();
  logger.info(`Serving endpoint at ${process.env.ENDPOINT}`);
});

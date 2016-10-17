'use strict';

const logger = require('./lib/logging');
const app = require('express')();
const graphqlHTTP = require('express-graphql');
const RootSchema = require('./models/root');

logger.info('Application started in ' + process.env.NODE_ENV + ' mode');

app.use(process.env.ENDPOINT, graphqlHTTP({
  schema: RootSchema,
  graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(process.env.PORT, function() {
  logger.info(`Serving endpoint at ${process.env.ENDPOINT}`);
});

'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const graphql = require('graphql-server-koa');

// Libraries
const timing = require('./lib/timing');
const logger = require('./lib/logging');

// Middleware
const responseTime = require('./middleware/response-time');
const accessLogger = require('./middleware/access-log');

const rootSchema = require('./schema/schema');
const serverTimer = new timing.Check('Starting koa server', 40, 100);

logger.info('Application started in ' + process.env.NODE_ENV + ' mode');

const app = new Koa();
const router = new Router();

// Apply middleware
app.use(koaBody());
app.use(accessLogger.mw);
app.use(responseTime.mw);

// Mount graphql endpoint
router.post('/graphql', graphql.graphqlKoa({
  schema: rootSchema
}));

// Register graphiql in development environment
if (process.env.NODE_ENV === 'development') {
  const graphiql = require('koa-graphiql').default;
  router.get('/graphql', graphiql());
}

app.use(router.routes());
app.use(router.allowedMethods());

// Start server
app.listen(process.env.PORT, function handleListenFinish() {
  serverTimer.stop();
  logger.info(`Serving endpoint at ${process.env.ENDPOINT}`);
});

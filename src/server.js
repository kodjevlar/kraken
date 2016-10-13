'use strict';

const app = require('express')();
const graphqlHTTP = require('express-graphql');
const Schema = require('./schema');

app.use(process.env.ENDPOINT, graphqlHTTP({
  schema: Schema,
  graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});

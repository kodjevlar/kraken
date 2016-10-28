# kraken
GraphQL server boilerplate

![](https://api.travis-ci.org/kodjevlar/kraken.svg?branch=development)
[![codecov](https://codecov.io/gh/kodjevlar/kraken/branch/development/graph/badge.svg)](https://codecov.io/gh/kodjevlar/kraken)


## Requirements
- docker
- docker-compose

## Development setup
`npm install`<br/>
`docker-compose up`

### Running tests
Run tests once and create code coverage report with: `npm test`

Run and watch tests with: `npm run test:watch`

## Workflow standards
In this section we define some rules that will guide the developers to follow
the same patterns when implementing support for more data types. These rules
may change over time.

Make sure you understand the basics of GraphQL before this section:
[http://graphql.org/learn/](http://graphql.org/learn/)

### Directory structure
Consider this basic directory structure

```
└── schema
    ├── interfaces
    │   └── displayproduct.js
    ├── mutations
    │   └── user
    │       ├── customer.js
    │       └── guest.js
    ├── resolvers
    │   └── user
    │       ├── customer.js
    │       └── guest.js
    ├── types
    │   ├── product
    │   │   ├── bundle.js
    │   │   ├── variable.js
    │   │   └── variant.js
    │   └── user
    │       ├── customer.js
    │       └── guest.js
    ├── unions
    │   ├── product.js
    │   └── user.js
    └── schema.js
```

---

### Implementing **types**
#### General
Each new type should be defined in a new module (file) inside `schema/types`.
Each type should be named in singular form.

Group the types inside a directory if it makes sense. The new type should in
that case be prefixed with the group name. For example, the `variant.js` in
`product` should be named `ProductVariant`.

Boilerplate for a new type, in this case `ProductVariant`:
```js
'use strict';
const gql = require('graphql');

const ProductVariant = new gql.GraphQLObjectType({
  name: 'ProductVariant',
  fields: {
    name: {
      type: gql.GraphQLString
    },
    price: {
      type: gql.GraphQLFloat
    }
  }
});

module.exports = ProductVariant;
```

#### Testing
[TBD] What testing makes sense for a new type?

---

### Implementing **interfaces**
#### General
The schema needs to know all available types when using interfaces, aswell as 
the types implementing the interface. This often creates a circular dependency
problem.

To work around this, use functional expressions when referencing the interface
(or any other type when circular dependencies becomes a problem).

Example:

```js
const schema = new gql.GraphQLSchema({
  types: (function() {
    return [DisplayProductInterface];
  })(),
  query: new gql.GraphQLObjectType({
   ...
```

#### Testing
...

---

### Implementing **resolvers**
#### General [TBD]
* Profiling
* Logging
* Caching

#### Testing
...

---

### Implementing **mutations**
#### General
...

#### Testing
...

---

### Testing
Tests are manditory, and should be created for every new file/module. Test files
are placed next to the implementation with `.spec.js` suffix like so:
```
└── user
    ├── customer.js
    ├── customer.spec.js
    ├── guest.js
    └── guest.spec.js
```

Code coverage reports will be generated to `coverage/lcov-report/index.html`

### Authentication
The scope of this project does not cover any authentication mechanism.
Authentication should be added to the service that responds to the query.
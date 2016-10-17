'use strict';

const chai = require('chai');
const expect = chai.expect;

const schema = require('../root');
const graphql = require('graphql').graphql;

describe('Customer schema', function() {
  var data = [];

  beforeEach(function() {
    data = [
      {
        firstname: 'Dev',
        lastname: 'Devsson',
        id: 1
      },
      {
        firstname: 'Ops',
        lastname: 'Opsson',
        id: 2
      }
    ];
  });

  it('Should get customer by id', function() {
    const query = `
      {
        customer (id: 1) {
          firstname,
          lastname,
          id
        }
      }
    `;

    const expected = {
      firstname: 'Dev',
      lastname: 'Devsson',
      id: 1
    };

    return graphql(schema, query).then(function(result) {
      expect(result).to.deep.equal(expected);
    });
  });
});

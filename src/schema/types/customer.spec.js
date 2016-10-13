'use strict';

const chai = require('chai');
const expect = chai.expect;

const customer = require('./customer');

describe('Customer schema', function() {

  it('Should export an object', function() {
    expect(typeof customer).to.equal('object');
  });
});

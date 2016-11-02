const chai = require('chai');
const expect = chai.expect;

const responseTime = require('./response-time');

describe('Respone time middleware', function() {
  it('should set the response time to context state', async function() {
    const ctx = {
      state: {}
    };

    await responseTime.mw(ctx, function() {
      return Promise.resolve();
    });

    expect(ctx.state.responseTime).to.be.above(0);
    expect(ctx.state.responseTime).to.be.below(5);
  });
});

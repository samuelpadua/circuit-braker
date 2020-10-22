const CircuitBreaker = require('opossum')
const { externalService } = require('./service')

const circuitBreakerOptions = {
  name: 'name-circuit-breaker',
  timeout: 500,
  errorThresholdPercentage: 20,
  resetTimeout: 10000,
  errorFilter: function (error) {
    if (error.response && error.response.status === 404) {
      return true 
    }

    return false
  }
}

const breaker = new CircuitBreaker(externalService, circuitBreakerOptions);
breaker.on('open', (other) =>  {
  const {
    failures,
    fallbacks,
    fires,
    successes,
    timeouts
  } = breaker.status.stats

  console.log("\x1b[31m", `OPEN: The breaker`)

  console.table({
    failures,
    fallbacks,
    fires,
    successes,
    timeouts
  })
});
breaker.on('halfOpen', () => console.log("\x1b[34m", `HALF_OPEN: The breaker`));
breaker.on('close', () => console.log("\x1b[32m", `CLOSE: The breaker`));

breaker.fallback((error, response) => {
  const {
    failures,
    fallbacks,
    fires,
    successes
  } = breaker.status.stats

  console.log("\x1b[33m", `called fallback - fires: ${fires} | failures: ${failures} | fallbacks: ${fallbacks} | successes: ${successes}`)

  return new Promise((resolve, reject) => {
    reject({
      status: 'in fallback'
    })
  })
});

module.exports = breaker

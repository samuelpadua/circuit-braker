const axios = require('axios')

function init() {
  let count = 0
  const quantityRequests = 10000

  const stop = (interval) => clearInterval(interval)

  const requestInterval = setInterval(() => {
    axios
      .get('http://localhost:3001/circuitbreaker')

    count++

    console.log('count => ', count);

    if (count === quantityRequests) {
      stop(requestInterval)
    }
  }, 100);
}

init()
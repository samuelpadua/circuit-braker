const axios = require('axios')

async function externalService (params) {
  return axios.get('http://localhost:3000/')
}

module.exports = {
  externalService
}

'use strict';

const Hapi = require('@hapi/hapi');
const breaker = require('./circuit-breaker');

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/circuitbreaker',
    handler: async (request, h) => {
      if (breaker.opened) {
        console.log('circuit breaker is open');

        return h.response({
          status: 'in fallback',
          message: 'circuit break is open'
        })
      }

      console.log('--------------------')
      try {
        const result = await breaker.fire(request, h)

        console.log("\x1b[32m", 'result from api => ', result.data);

        return h.response({
          status: 'OK',
          result: result.data
        })
      } catch (error) {
        if (error) {
          console.log("\x1b[31m", 'error from api => ', error)
        }

        return h
          .response({
            status: 'Error',
            error
          })
          .code(500)
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
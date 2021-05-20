/* eslint-disable no-console */

const Hapi = require('@hapi/hapi');
const routes = require('./app/routes/bookRoutes');

const server = Hapi.server({
  port: 3000,
  host: process.env.NODE_ENV !== 'production' ? 'localhost' : '127.0.0.1',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});

server.route(routes);

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
init();

const hello = require('./hello_routes');
const attackRoutes = require('./board/attack_routes');
const boardRoutes = require('./board/board_routes');
const initializeRoutes = require('./board/initialize_routes');

module.exports = function(app) {
  app.route('/hello')
    .get(hello.getHello)
    .post(hello.postHello);

  // helloRoutes(app);
  attackRoutes(app);
  boardRoutes(app);
  initializeRoutes(app);
};
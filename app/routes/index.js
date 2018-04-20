const hello = require('./hello_routes');
const board = require('./board_routes')
module.exports = function(app) {
  app.route('/hello')
    .get(hello.getHello)
    .post(hello.postHello);

  app.route('/board/list')
    .get(board.getBoards);

  app.route('/board')
    .get(board.initilize);

  app.route('/board/:id')
    .get(board.getBoardById);

  app.route('/board/attack/:id')
    .post(board.attack);

  app.route('/board/reset/:id')
    .get(board.reset);

  app.route('/board/history/:id')
    .get(board.getHistoryById);

};
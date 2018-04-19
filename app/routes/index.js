const helloRoutes = require('./hello_routes');

module.exports = function(app, db) {
  helloRoutes(app, db);
};
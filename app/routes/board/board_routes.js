module.exports = function(app) {
  app.get('/board/:id', (req, res) => {
    res.status(501)             // HTTP status 501 Not Implemented
      .send('Not Implemented');
  });
};
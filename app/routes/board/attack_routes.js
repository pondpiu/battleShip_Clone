module.exports = function(app) {
  app.post('/board/attack/:id', (req, res) => {
    console.log(req.body);
    res.status(501)             // HTTP status 501 Not Implemented
      .send('Not Implemented');
  });
};
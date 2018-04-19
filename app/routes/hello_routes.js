module.exports = function(app, db) {
  app.post('/hello', (req, res) => {
    console.log(req.body);
    res.send('Hello World!');
  });
};
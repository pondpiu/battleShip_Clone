'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json'}));  

if (app.get('env') == 'production') {
  app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else if (app.get('env') !== 'test') {
  app.use(morgan('dev'));
}

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

require('./app/routes')(app)
app.listen(PORT, () => console.log('listening on port:', PORT));

module.exports = app; // for testing
const mongoose = require('mongoose');
const Board = require('../models/board');
const BoardHistory = require('../models/boardHistory');

function getBoards(req, res){
  const query = Board.find({});
  query.exec((err, boards) =>{
    if(err) res.send(err);

    res.status(200)
      .json(boards);
  })
    
}

function initilize(req, res){
  res.status(501)
    .send('Not Implemented');
}

function getBoardById(req, res){
  res.status(501)
    .send('Not Implemented');
}

function attack(req, res){
  res.status(501)
    .send('Not Implemented');
}

function reset(req, res){
  res.status(501)
    .send('Not Implemented');
}

function getHistoryById(req, res){
  const query = BoardHistory.find({
    id : req.params.id
  });
  query.exec((err, boardHistories) =>{
    if(err) res.send(err);

    res.status(200)
      .json(boardHistories);
  })
}

module.exports = { getBoards, getBoardById, initilize, attack, reset, getHistoryById };
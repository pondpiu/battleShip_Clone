const mongoose = require('mongoose');
const Board = require('../models/board');
const BoardHistory = require('../models/boardHistory');
const BattleShip = require('../battleShip')

function getBoards(req, res){
  const query = Board.find({});
  query.exec((err, boards) =>{
    if(err) res.send(err);

    res.status(200)
      .json(boards);
  })
    
}

function initilize(req, res){
  const emptyOcean = BattleShip.createEmptyOcean(10,10);
  const newOcean = BattleShip.placeShips(emptyOcean, 1, 2, 3, 4);
  const newBoard = new Board(
    {
      ocean: newOcean,
      moveNum: 0
    }
  );
  //send client version of the board
  let visibleBoard = new Board(newBoard);
  visibleBoard.ocean = visibleBoard.ocean.map( (waterArray) =>{
    return waterArray.map( (water) => {
      visibleUnit = -1;
      //only show unit type if its type 3 (already been sunk)
      if(water.type == 3){
        visibleUnit = water.unit;
      }
      visibleWater = {
        type: water.type,
        unit: visibleUnit
      };
      return visibleWater;
    });
  });
  
  BattleShip.printOcean(newBoard.ocean);

  res.status(200)
    .send(newBoard);
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
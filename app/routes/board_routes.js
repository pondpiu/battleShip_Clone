const mongoose = require('mongoose');
const Board = require('../models/board');
const BoardHistory = require('../models/boardHistory');


const Logger = require('../logger');
const BattleShip = require('../battleShip');
const History = require('../history');

function getBoards(req, res){
  const query = Board.find({}, '_id moveNum createAt');
  query.exec((err, boards) =>{
    if(err) res.send(err);

    res.status(200)
      .json(boards);
  })
    
}

function initilize(req, res){
  const newOcean = BattleShip.generateNewOcean(); 
  const newBoard = new Board(
    {
      ocean: newOcean[0],
      unitLeft: newOcean[1],
      moveNum: 0
    }
  );
  //send client version of the board
  let visibleBoard = BattleShip.generateClientBoard(newBoard._id, newBoard.moveNum, newBoard.ocean, newBoard.createAt);
  
  BattleShip.printOcean(newBoard.ocean);

  newBoard.save((err,board) =>{
    if(err){ res.send(err); }
    else{
      History.saveHistory(board)
      res.status(200)
        .json({message: "Board successfully initialize!", board: visibleBoard});
    }
  });
}

function getBoardById(req, res){
  const query = Board.findById(req.params.id);
  query.exec((err, board) => {
    if(err) {res.send(err);}
    else{
      if(!board) {
        res.status(200)
          .json({message: "Board "+req.params.id+" not found"});
      }else{
        let visibleBoard = BattleShip.generateClientBoard(board.id, board.moveNum, board.ocean, board.createAt);
        res.status(200)
        .json({board: visibleBoard});
      }
    }
  });
}

function attack(req, res){
  res.status(501)
    .send('Not Implemented');
}

function reset(req, res){
  const query = Board.findById(req.params.id);
  query.exec((err, board) => {
    if(err) {
      res.send(err);
    }
    else{
      if(!board) {
        res.status(200)
          .json({message: "Board "+req.params.id+" not found"});
      }else{
        let newOcean = BattleShip.generateNewOcean();
        board.ocean = newOcean[0];
        board.unitLeft = newOcean[1];
        board.createAt = new Date();
        board.moveNum = 0;
        board.save((err, board) => {
          if(err) { res.send(err); }
          else{
            let visibleBoard = BattleShip.generateClientBoard(board.id, board.moveNum, board.ocean, board.createAt);
            res.status(200)
            .json({message: "Board reset secuessfully", board: visibleBoard});
          }
        });
      }
    }
  });
}

function getHistoryById(req, res){
  const query = BoardHistory.find({
    boardId : req.params.id
  });
  query.exec((err, boardHistories) => {
    if(err) res.send(err);

    res.status(200)
      .json(boardHistories);
  })
}

module.exports = { getBoards, getBoardById, initilize, attack, reset, getHistoryById };
const mongoose = require('mongoose');
const Board = require('../models/board');
const BoardHistory = require('../models/boardHistory');


const Logger = require('../logger');
const BattleShip = require('../battleShip');
const History = require('../history');

function getBoards(req, res){
  const query = Board.find({}, '_id moveNum updateAt');
  query.exec((err, boards) =>{
    if(err) { res.send(err); return; }

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
  let visibleBoard = BattleShip.generateClientBoard(newBoard._id, newBoard.moveNum, newBoard.ocean, newBoard.updateAt);
  
  BattleShip.printOcean(newBoard.ocean);

  newBoard.save((err,board) =>{
    if(err){ res.send(err); return;}

    History.saveHistory(board, "initialize");
    res.status(200)
      .json({message: "Board successfully initialize!", board: visibleBoard});
  });
}

function getBoardById(req, res){
  const query = Board.findById(req.params.id);
  query.exec((err, board) => {
    if(err) { res.send(err); return;}
    if(!board) {
      res.status(200)
        .json({message: "Board "+req.params.id+" not found"});
      return;
    }

    let visibleBoard = BattleShip.generateClientBoard(board.id, board.moveNum, board.ocean, board.updateAt);
    res.status(200)
    .json({board: visibleBoard});
  });
}

function attack(req, res){
  if(req.body.x == null || req.body.y == null){ res.status(400).send("Bad Request : missing x or y payload"); return; }
  const query = Board.findById(req.params.id);
  query.exec((err, board) => {
    if(err) { res.send(err); return;}
    if(!board){
      res.status(200)
        .json({message: "Board "+req.params.id+" not found"});
      return;
    }
    if( board.unitLeft <1) {
      res.status(200)
        .json({ message: "Game already ended. All the ship has been sunk. You completed the game in"+ board.moveNum +"moves"}); 
      return;
    }

    attackResult = attackOceanAtPos(req.body.x, req.body.y, board);
    resultCode = attackResult[0];
    resultMsg = attackResult[1];
    let newBoard = attackResult[2];
    newBoard.markModified('ocean'); // mongoose dont detect change in nested array, mark it manually
    newBoard.save((err, savedBoard) => {
      if(err) { res.send(err); return; }
      let response = {};
      if(savedBoard.unitLeft < 1){
        resultMsg = "Win !  You completed the game in "+ savedBoard.moveNum +" moves";
        response.board = savedBoard;
      }

      History.saveHistory(savedBoard, resultMsg);
      response.message = resultMsg;
      res.status(200)
        .json(response)
    });
  });
}

function reset(req, res){
  const query = Board.findById(req.params.id);
  query.exec((err, board) => {
    if(err) { res.send(err); return; }
    if(!board) {
      res.status(200)
        .json({message: "Board "+req.params.id+" not found"});
      return;
    }

    let newOcean = BattleShip.generateNewOcean();
    board.ocean = newOcean[0];
    board.unitLeft = newOcean[1];
    board.updateAt = new Date();
    board.moveNum = 0;
    board.save((err, board) => {
      if(err) { res.send(err); return; }

      History.saveHistory(board, "reset");
      const visibleBoard = BattleShip.generateClientBoard(board.id, board.moveNum, board.ocean, board.updateAt);
      res.status(200)
      .json({message: "Board reset secuessfully", board: visibleBoard});
    });
  

  });
}

function getHistoryById(req, res){
  const query = BoardHistory.find({
    boardId : req.params.id
  });
  query.exec((err, boardHistories) => {
    if(err) {res.send(err); return; }

    res.status(200)
      .json(boardHistories);
  })
}

function attackOceanAtPos(x, y, board){
  let battleResult = BattleShip.attackWaterAtPos(x, y, board.ocean);
  const resultCode = battleResult[0];
  const resultMsg = battleResult[1];
  const resultOcean = battleResult[2];
  board.ocean = resultOcean;
  board.updateAt = new Date();
  board.moveNum = board.moveNum+1;
  
  if(resultCode == 3){ //a ship has been sunk
    board.unitLeft = board.unitLeft-1;
  }

  return [resultCode, resultMsg, board];
}

module.exports = { getBoards, getBoardById, initilize, attack, reset, getHistoryById };